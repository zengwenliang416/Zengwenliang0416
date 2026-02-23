import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  GPGPUSimulation,
  SIM_TEXTURE_SIZE,
  PARTICLE_COUNT,
} from "./GPGPUSimulation";
import {
  noiseVertex,
  noiseFragment,
  instanceVertex,
  instanceFragment,
  fogVertex,
  fogFragment,
  gaussianBlurFragment,
  bloomCompositeFragment,
  colorGradeDitherFragment,
} from "./shaders";

const PASS_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/**
 * Lusion-style 4-level cascaded Gaussian blur + weighted bloom composite.
 * Each level: H blur → V blur at half resolution (progressive downscale).
 */
class CascadedBloom {
  private blurMat: THREE.ShaderMaterial;
  private compositeMat: THREE.ShaderMaterial;
  private levels: {
    rtH: THREE.WebGLRenderTarget;
    rtV: THREE.WebGLRenderTarget;
  }[] = [];
  private quad: THREE.Mesh;
  private camera: THREE.OrthographicCamera;
  private scene: THREE.Scene;

  constructor(w: number, h: number) {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.scene.add(this.quad);

    this.blurMat = new THREE.ShaderMaterial({
      vertexShader: PASS_VERT,
      fragmentShader: gaussianBlurFragment,
      uniforms: {
        tDiffuse: { value: null },
        u_direction: { value: new THREE.Vector2(1, 0) },
        u_resolution: { value: new THREE.Vector2(w, h) },
      },
    });

    this.compositeMat = new THREE.ShaderMaterial({
      vertexShader: PASS_VERT,
      fragmentShader: bloomCompositeFragment,
      uniforms: {
        tDiffuse: { value: null },
        u_blur1: { value: null },
        u_blur2: { value: null },
        u_blur3: { value: null },
        u_blur4: { value: null },
        u_bloomAmount: { value: 1.8 },
      },
    });

    // 4 blur levels at progressively halved resolution
    let lw = Math.floor(w / 2);
    let lh = Math.floor(h / 2);
    for (let i = 0; i < 4; i++) {
      this.levels.push({
        rtH: new THREE.WebGLRenderTarget(lw, lh, { type: THREE.HalfFloatType }),
        rtV: new THREE.WebGLRenderTarget(lw, lh, { type: THREE.HalfFloatType }),
      });
      lw = Math.max(1, Math.floor(lw / 2));
      lh = Math.max(1, Math.floor(lh / 2));
    }
  }

  render(
    renderer: THREE.WebGLRenderer,
    inputRT: THREE.WebGLRenderTarget,
    outputRT: THREE.WebGLRenderTarget | null,
  ) {
    let src: THREE.Texture = inputRT.texture;
    const ITERATIONS = 3; // Lusion uses ~6; 3 with wide kernel is equivalent

    // Cascade: each level blurs with multiple H+V iterations
    for (let i = 0; i < 4; i++) {
      const { rtH, rtV } = this.levels[i];
      let levelSrc = src;

      for (let iter = 0; iter < ITERATIONS; iter++) {
        // Horizontal pass
        this.blurMat.uniforms.tDiffuse.value = levelSrc;
        this.blurMat.uniforms.u_direction.value.set(1, 0);
        this.blurMat.uniforms.u_resolution.value.set(rtH.width, rtH.height);
        this.quad.material = this.blurMat;
        renderer.setRenderTarget(rtH);
        renderer.render(this.scene, this.camera);

        // Vertical pass
        this.blurMat.uniforms.tDiffuse.value = rtH.texture;
        this.blurMat.uniforms.u_direction.value.set(0, 1);
        this.quad.material = this.blurMat;
        renderer.setRenderTarget(rtV);
        renderer.render(this.scene, this.camera);

        levelSrc = rtV.texture;
      }

      src = rtV.texture;
    }

    // Composite: original + weighted blur levels
    this.compositeMat.uniforms.tDiffuse.value = inputRT.texture;
    this.compositeMat.uniforms.u_blur1.value = this.levels[0].rtV.texture;
    this.compositeMat.uniforms.u_blur2.value = this.levels[1].rtV.texture;
    this.compositeMat.uniforms.u_blur3.value = this.levels[2].rtV.texture;
    this.compositeMat.uniforms.u_blur4.value = this.levels[3].rtV.texture;
    this.quad.material = this.compositeMat;
    renderer.setRenderTarget(outputRT);
    renderer.render(this.scene, this.camera);
  }

  resize(w: number, h: number) {
    let lw = Math.floor(w / 2);
    let lh = Math.floor(h / 2);
    for (let i = 0; i < 4; i++) {
      this.levels[i].rtH.setSize(lw, lh);
      this.levels[i].rtV.setSize(lw, lh);
      lw = Math.max(1, Math.floor(lw / 2));
      lh = Math.max(1, Math.floor(lh / 2));
    }
  }

  dispose() {
    this.blurMat.dispose();
    this.compositeMat.dispose();
    this.quad.geometry.dispose();
    for (const l of this.levels) {
      l.rtH.dispose();
      l.rtV.dispose();
    }
  }
}

/** Generate a procedural matcap texture on canvas */
function createMatcapTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const center = size / 2;
  const radius = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - center) / radius;
      const ny = (y - center) / radius;
      const dist = Math.sqrt(nx * nx + ny * ny);

      if (dist > 1.0) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(x, y, 1, 1);
        continue;
      }

      const nz = Math.sqrt(1.0 - dist * dist);

      // Hemisphere lighting with rim
      const lightX = 0.3;
      const lightY = 0.5;
      const lightZ = 0.8;
      const lightLen = Math.sqrt(
        lightX * lightX + lightY * lightY + lightZ * lightZ,
      );
      const dotLight = (nx * lightX + -ny * lightY + nz * lightZ) / lightLen;

      // Fresnel rim light
      const fresnel = Math.pow(1.0 - nz, 3.0);

      // Specular highlight
      const halfX = lightX;
      const halfY = lightY;
      const halfZ = lightZ + 1.0;
      const halfLen = Math.sqrt(halfX * halfX + halfY * halfY + halfZ * halfZ);
      const dotHalf = (nx * halfX + -ny * halfY + nz * halfZ) / halfLen;
      const spec = Math.pow(Math.max(0, dotHalf), 32) * 0.3;

      // Combine
      const diff = Math.max(0, dotLight) * 0.4 + 0.1;
      const rim = fresnel * 0.15;
      let val = diff + spec + rim;
      val = Math.min(1.0, Math.max(0, val));

      // Cool metallic tone
      const r = Math.round(val * 200);
      const g = Math.round(val * 205);
      const b = Math.round(val * 215);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function WebGLCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    camera.position.set(0, 0, 5);

    // --- GPGPU Particle Simulation ---
    const gpgpu = new GPGPUSimulation(renderer);

    // --- Custom Post-processing: Lusion-style cascaded blur + bloom ---
    const sceneRT = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { type: THREE.HalfFloatType },
    );
    const cascadedBloom = new CascadedBloom(
      window.innerWidth,
      window.innerHeight,
    );

    // Dithering + color grading final pass
    const ditheringMat = new THREE.ShaderMaterial({
      vertexShader: PASS_VERT,
      fragmentShader: colorGradeDitherFragment,
      uniforms: { tDiffuse: { value: null } },
    });
    const finalQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      ditheringMat,
    );
    const finalScene = new THREE.Scene();
    finalScene.add(finalQuad);
    const finalCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const finalRT = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
    );

    // --- Background noise plane ---
    const noiseMat = new THREE.ShaderMaterial({
      vertexShader: noiseVertex,
      fragmentShader: noiseFragment,
      uniforms: {
        u_time: { value: 0 },
        u_opacity: { value: 0.003 },
        u_resolution: { value: new THREE.Vector2(1, 1) },
        u_color1: {
          value: new THREE.Color(0xffffff).multiplyScalar(0.005),
        },
        u_color2: {
          value: new THREE.Color(0xffffff).multiplyScalar(0.004),
        },
        u_color3: {
          value: new THREE.Color(0xffffff).multiplyScalar(0.003),
        },
      },
      transparent: true,
      depthWrite: false,
    });
    const noisePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      noiseMat,
    );
    noisePlane.position.z = -4;
    scene.add(noisePlane);

    // --- Fog overlay plane ---
    const fogLoader = new THREE.TextureLoader();
    const fogMat = new THREE.ShaderMaterial({
      vertexShader: fogVertex,
      fragmentShader: fogFragment,
      uniforms: {
        u_fogMap: { value: null },
        u_time: { value: 0 },
        u_opacity: { value: 0.55 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    fogLoader.load("/textures/fog.png", (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      fogMat.uniforms.u_fogMap.value = tex;
    });

    const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), fogMat);
    fogPlane.position.z = -0.5;
    fogPlane.renderOrder = 10;
    scene.add(fogPlane);

    // --- Matcap texture ---
    const matcapTex = createMatcapTexture(256);

    // --- Instanced particle mesh (GPGPU driven) ---
    const baseGeo = new THREE.IcosahedronGeometry(1, 2);
    const instanceGeo = new THREE.InstancedBufferGeometry();
    instanceGeo.index = baseGeo.index;
    instanceGeo.setAttribute("position", baseGeo.getAttribute("position"));
    instanceGeo.setAttribute("normal", baseGeo.getAttribute("normal"));
    instanceGeo.instanceCount = PARTICLE_COUNT;

    const indices = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const emissive = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      indices[i] = i;
      scales[i] = 0.5 + Math.random() * 0.5;
      emissive[i] = Math.random() < 0.1 ? 1.0 : 0.0;
    }

    instanceGeo.setAttribute(
      "instanceIndex",
      new THREE.InstancedBufferAttribute(indices, 1),
    );
    instanceGeo.setAttribute(
      "instanceScale",
      new THREE.InstancedBufferAttribute(scales, 1),
    );
    instanceGeo.setAttribute(
      "instanceEmissive",
      new THREE.InstancedBufferAttribute(emissive, 1),
    );

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: instanceVertex,
      fragmentShader: instanceFragment,
      uniforms: {
        u_simTexture: { value: null },
        u_simSize: {
          value: new THREE.Vector2(SIM_TEXTURE_SIZE, SIM_TEXTURE_SIZE),
        },
        u_time: { value: 0 },
        u_scroll: { value: 0 },
        u_matcap: { value: matcapTex },
      },
      depthWrite: true,
      depthTest: true,
      transparent: false,
      side: THREE.FrontSide,
    });

    const particles = new THREE.Mesh(instanceGeo, particleMat);
    scene.add(particles);

    // --- Input ---
    const mouse = { x: 0, y: 0 };
    const smoothMouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      sceneRT.setSize(w, h);
      finalRT.setSize(w, h);
      cascadedBloom.resize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- Animation loop ---
    const clock = new THREE.Clock();
    let raf = 0;
    let prevTime = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = elapsed - prevTime;
      prevTime = elapsed;

      const scrollY = window.scrollY / window.innerHeight;

      // Smooth mouse
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.025;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.025;

      // Update GPGPU simulation
      gpgpu.update(elapsed, delta, scrollY, smoothMouse);

      // Update uniforms
      noiseMat.uniforms.u_time.value = elapsed;
      fogMat.uniforms.u_time.value = elapsed;

      particleMat.uniforms.u_time.value = elapsed;
      particleMat.uniforms.u_scroll.value = scrollY;
      if (gpgpu.positionTexture) {
        particleMat.uniforms.u_simTexture.value = gpgpu.positionTexture;
      }

      // Slow rotation + scroll-driven camera parallax
      particles.rotation.y = elapsed * 0.018 + scrollY * 0.08;
      particles.rotation.x = Math.sin(elapsed * 0.01) * 0.05 + scrollY * 0.03;
      camera.position.y = -scrollY * 0.15;
      camera.position.z = 5 + scrollY * 0.1;

      // Render pipeline: scene → sceneRT → cascaded bloom → dithering → screen
      renderer.setRenderTarget(sceneRT);
      renderer.render(scene, camera);

      cascadedBloom.render(renderer, sceneRT, finalRT);

      ditheringMat.uniforms.tDiffuse.value = finalRT.texture;
      renderer.setRenderTarget(null);
      renderer.render(finalScene, finalCam);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      gpgpu.dispose();
      matcapTex.dispose();
      sceneRT.dispose();
      finalRT.dispose();
      cascadedBloom.dispose();
      ditheringMat.dispose();
      finalQuad.geometry.dispose();
      renderer.dispose();
      instanceGeo.dispose();
      baseGeo.dispose();
      particleMat.dispose();
      noiseMat.dispose();
      fogMat.dispose();
      noisePlane.geometry.dispose();
      fogPlane.geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
