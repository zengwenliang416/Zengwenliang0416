import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";

const SIM_SIZE = 128; // 128 * 128 = 16384 particles
const CLOUD_Y_OFFSET = 0.6;

const simulationShader = /* glsl */ `
uniform float u_time;
uniform float u_delta;
uniform float u_scroll;
uniform vec2 u_mouse;

// Simplex-based curl noise for organic motion
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289v4(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289v3(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Curl noise: compute curl of 3D noise field for divergence-free flow
vec3 curlNoise(vec3 p) {
  float e = 0.1;
  float n1 = snoise(p + vec3(e, 0.0, 0.0));
  float n2 = snoise(p - vec3(e, 0.0, 0.0));
  float n3 = snoise(p + vec3(0.0, e, 0.0));
  float n4 = snoise(p - vec3(0.0, e, 0.0));
  float n5 = snoise(p + vec3(0.0, 0.0, e));
  float n6 = snoise(p - vec3(0.0, 0.0, e));

  float dx = (n3 - n4) - (n5 - n6);
  float dy = (n5 - n6) - (n1 - n2);
  float dz = (n1 - n2) - (n3 - n4);

  return normalize(vec3(dx, dy, dz)) / (2.0 * e);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 posLife = texture2D(texturePosition, uv);
  vec3 pos = posLife.xyz;
  float life = posLife.w; // w = phase (0..1)

  float t = u_time * 0.05;

  // Multi-scale curl noise for organic drift
  vec3 curl1 = curlNoise(pos * 0.4 + t * 0.3) * 0.025;
  vec3 curl2 = curlNoise(pos * 0.8 + t * 0.5 + 100.0) * 0.012;
  vec3 curl3 = curlNoise(pos * 1.5 + t * 0.2 + 200.0) * 0.006;
  vec3 velocity = curl1 + curl2 + curl3;

  // Gentle attraction to center (keeps particles from drifting away)
  vec3 center = vec3(0.0, ${CLOUD_Y_OFFSET.toFixed(1)}, 0.0);
  vec3 toCenter = center - pos;
  float dist = length(toCenter);
  velocity += normalize(toCenter) * smoothstep(4.0, 1.5, dist) * 0.002;

  // Breathing: subtle radial expansion/contraction
  float breath = sin(u_time * 0.035 + life * 6.283) * 0.001;
  velocity += normalize(pos - center) * breath;

  // Mouse repulsion
  vec3 mouseWorld = vec3(u_mouse.x * 3.0, u_mouse.y * 2.0 + ${CLOUD_Y_OFFSET.toFixed(1)}, 2.0);
  vec3 toMouse = pos - mouseWorld;
  float mouseDist = length(toMouse);
  velocity += normalize(toMouse) * smoothstep(2.0, 0.0, mouseDist) * 0.008;

  pos += velocity * u_delta * 60.0;

  gl_FragColor = vec4(pos, life);
}
`;

export const SIM_TEXTURE_SIZE = SIM_SIZE;
export const PARTICLE_COUNT = SIM_SIZE * SIM_SIZE;

export class GPGPUSimulation {
  private gpuCompute: GPUComputationRenderer;
  private positionVariable: ReturnType<
    GPUComputationRenderer["addVariable"]
  > | null = null;

  constructor(renderer: THREE.WebGLRenderer) {
    this.gpuCompute = new GPUComputationRenderer(SIM_SIZE, SIM_SIZE, renderer);

    if (
      renderer.capabilities.isWebGL2 === false &&
      renderer.extensions.has("OES_texture_float") === false
    ) {
      console.warn("[GPGPU] Float textures not supported, falling back");
      return;
    }

    const dtPosition = this.gpuCompute.createTexture();
    this.fillPositions(dtPosition);

    this.positionVariable = this.gpuCompute.addVariable(
      "texturePosition",
      simulationShader,
      dtPosition,
    );

    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
    ]);

    const uniforms = this.positionVariable.material.uniforms;
    uniforms.u_time = { value: 0 };
    uniforms.u_delta = { value: 1 / 60 };
    uniforms.u_scroll = { value: 0 };
    uniforms.u_mouse = { value: new THREE.Vector2(0, 0) };

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error("[GPGPU] Init error:", error);
      this.positionVariable = null;
    }
  }

  private fillPositions(texture: THREE.DataTexture) {
    const data = texture.image.data as Float32Array;
    for (let i = 0; i < data.length; i += 4) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rnd = Math.random();

      let r: number;
      if (rnd < 0.35) {
        r = Math.pow(Math.random(), 0.7) * 1.2;
      } else if (rnd < 0.7) {
        r = 1.0 + Math.pow(Math.random(), 0.5) * 1.5;
      } else {
        r = 2.0 + Math.pow(Math.random(), 0.4) * 2.0;
      }

      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta) + CLOUD_Y_OFFSET;
      let z = r * Math.cos(phi);

      // Organic distortion
      const layer = rnd < 0.35 ? 0.0 : rnd < 0.7 ? 0.5 : 1.0;
      const freq = 2.5 + layer * 1.5;
      x += Math.sin(y * freq + z * 2.3) * 0.35 * (1.0 + layer * 0.5);
      y += Math.cos(x * 2.8 + z * freq) * 0.35 * (1.0 + layer * 0.5);
      z += Math.sin(x * 2.1 + y * 2.7) * 0.2;

      data[i] = x;
      data[i + 1] = y;
      data[i + 2] = z;
      data[i + 3] = Math.random(); // phase
    }
  }

  get ready() {
    return this.positionVariable !== null;
  }

  update(time: number, delta: number, scroll: number, mouse: THREE.Vector2) {
    if (!this.positionVariable) return;
    const u = this.positionVariable.material.uniforms;
    u.u_time.value = time;
    u.u_delta.value = Math.min(delta, 1 / 30);
    u.u_scroll.value = scroll;
    u.u_mouse.value.copy(mouse);
    this.gpuCompute.compute();
  }

  get positionTexture(): THREE.Texture | null {
    if (!this.positionVariable) return null;
    return this.gpuCompute.getCurrentRenderTarget(this.positionVariable)
      .texture;
  }

  dispose() {
    this.gpuCompute.dispose();
  }
}
