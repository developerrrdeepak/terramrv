import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Leaf({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
    }
  });

  // Create leaf shape
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.2, 0.4, 0.4, 0.8, 0, 1);
  leafShape.bezierCurveTo(-0.4, 0.8, -0.2, 0.4, 0, 0);

  const extrudeSettings = {
    depth: 0.02,
    bevelEnabled: false,
  };

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[leafShape, extrudeSettings]} />
      <meshStandardMaterial color="#059669" side={THREE.DoubleSide} />
    </mesh>
  );
}
