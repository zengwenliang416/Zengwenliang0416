import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { noiseVertex, noiseFragment } from "./shaders";

export default function BackgroundNoise() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_opacity: { value: 0.06 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_color1: { value: new THREE.Color(0xff3c5f).multiplyScalar(0.15) },
      u_color2: { value: new THREE.Color(0x5856d6).multiplyScalar(0.12) },
      u_color3: { value: new THREE.Color(0xc8ff00).multiplyScalar(0.08) },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.u_time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <planeGeometry args={[12, 12]} />
      <shaderMaterial
        vertexShader={noiseVertex}
        fragmentShader={noiseFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
