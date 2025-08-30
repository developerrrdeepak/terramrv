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
      <Sphere ref={meshRef} args={[2, 32, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4ade80"
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </Sphere>
      
      {/* Inner glow sphere */}
      <Sphere args={[1.9, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#22d3ee"
          transparent={true}
          opacity={0.1}
        />
      </Sphere>
      
      {/* Continent outlines */}
      <Sphere args={[2.01, 32, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#6ee7b7"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
}
