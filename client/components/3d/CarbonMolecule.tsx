import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function CarbonMolecule({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central carbon atom */}
      <Sphere args={[0.15]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#374151" />
      </Sphere>
      
      {/* Oxygen atoms */}
      <Sphere args={[0.12]} position={[0.4, 0, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
      
      <Sphere args={[0.12]} position={[-0.4, 0, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
      
      {/* Bonds */}
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </group>
  );
}
