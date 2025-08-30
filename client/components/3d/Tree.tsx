import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Cone, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export function Tree({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Tree trunk */}
      <Cylinder args={[0.1, 0.15, 1]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Cylinder>

      {/* Tree leaves */}
      <Cone args={[0.6, 1.2]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#22c55e" />
      </Cone>

      <Cone args={[0.5, 1]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#16a34a" />
      </Cone>
    </group>
  );
}
