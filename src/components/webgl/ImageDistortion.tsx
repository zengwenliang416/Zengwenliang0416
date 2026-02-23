import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { distortionVertex, distortionFragment } from "./shaders";
import { lerp } from "../../lib/math";

interface ImageDistortionProps {
  src: string;
  width: number;
  height: number;
}

export default function ImageDistortion({
  src,
  width,
  height,
}: ImageDistortionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { viewport } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(src, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexture(tex);
    });
  }, [src]);

  const uniforms = useMemo(
    () => ({
      u_texture: { value: null as THREE.Texture | null },
      u_hover: { value: 0 },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useEffect(() => {
    if (texture) uniforms.u_texture.value = texture;
  }, [texture, uniforms]);

  useFrame((state) => {
    uniforms.u_time.value = state.clock.elapsedTime;
    uniforms.u_hover.value = lerp(
      uniforms.u_hover.value,
      hoverRef.current,
      0.06,
    );
    uniforms.u_mouse.value.lerp(mouseRef.current, 0.08);
  });

  const aspect = width / height;
  const planeW = Math.min(viewport.width * 0.8, 3);
  const planeH = planeW / aspect;

  const onPointerMove = (e: THREE.Event & { uv?: THREE.Vector2 }) => {
    if (e.uv) mouseRef.current.copy(e.uv);
    hoverRef.current = 1;
  };

  const onPointerLeave = () => {
    hoverRef.current = 0;
  };

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <planeGeometry args={[planeW, planeH, 32, 32]} />
      <shaderMaterial
        vertexShader={distortionVertex}
        fragmentShader={distortionFragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
