import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

export function WireframeGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.1;
      globeRef.current.rotation.x = Math.sin(time * 0.05) * 0.1 + 0.1;
    }

    // Pulsing inner glow
    if (innerRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      innerRef.current.scale.setScalar(scale);
    }

    // Rotating rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3;
      ring1Ref.current.rotation.z = time * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.4;
      ring2Ref.current.rotation.z = -time * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.25;
      ring3Ref.current.rotation.y = time * 0.35;
    }
  });

  return (
    <group position={[2, 0, 0]}>
      {/* Main wireframe globe */}
      <group ref={globeRef}>
        <Sphere args={[2, 64, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#16A34A"
            wireframe={true}
            transparent={true}
            opacity={0.9}
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

      {/* Pulsing inner glow sphere */}
      <Sphere ref={innerRef} args={[1.9, 32, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#22C55E" transparent={true} opacity={0.15} />
      </Sphere>

      {/* Rotating energy rings */}
      <Torus ref={ring1Ref} args={[2.5, 0.02, 8, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#16A34A" transparent={true} opacity={0.7} />
      </Torus>

      <Torus ref={ring2Ref} args={[2.8, 0.015, 8, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#22C55E" transparent={true} opacity={0.5} />
      </Torus>

      <Torus ref={ring3Ref} args={[3.1, 0.01, 8, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#16A34A" transparent={true} opacity={0.3} />
      </Torus>

      {/* Outer glow effect */}
      <Sphere args={[3.5, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#22C55E" transparent={true} opacity={0.05} />
      </Sphere>
    </group>
  );
}
