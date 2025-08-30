import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function WireframeGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1 + 0.1;
    }
  });

  return (
    <group position={[2, 0, 0]}>
      {/* Main wireframe globe */}
      <Sphere ref={meshRef} args={[2, 64, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#16A34A"
          wireframe={true}
          transparent={true}
          opacity={0.9}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.9, 32, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#22C55E"
          transparent={true}
          opacity={0.2}
        />
      </Sphere>

      {/* Continent outlines */}
      <Sphere args={[2.02, 64, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#22C55E"
          wireframe={true}
          transparent={true}
          opacity={0.5}
        />
      </Sphere>
    </group>
  );
}
