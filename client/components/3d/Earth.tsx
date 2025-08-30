import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.2, 32, 32]} position={[2, 0, 0]}>
      <meshStandardMaterial
        color="#16a34a"
        roughness={0.3}
        metalness={0.1}
        wireframe={false}
      />
    </Sphere>
  );
}
