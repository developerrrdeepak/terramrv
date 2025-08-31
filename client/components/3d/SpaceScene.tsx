import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SpaceScene() {
  const starsRef = useRef<THREE.Points>(null);
  const nebula1Ref = useRef<THREE.Mesh>(null);
  const nebula2Ref = useRef<THREE.Mesh>(null);

  // Create star field
  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  const starColors = useMemo(() => {
    const colors = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const color = new THREE.Color();
      // Mix of white, blue, and green tints for stars
      const starType = Math.random();
      if (starType < 0.7) {
        color.setHex(0xffffff); // White stars
      } else if (starType < 0.9) {
        color.setHex(0x8ee5ff); // Blue stars
      } else {
        color.setHex(0x90ff90); // Green stars
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.001;
      starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.0005;
    }

    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.z = state.clock.getElapsedTime() * 0.002;
      const mat1 = nebula1Ref.current.material;
      const val1 = 0.1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      if (Array.isArray(mat1)) {
        mat1.forEach((m) => {
          if ("opacity" in m) (m as THREE.Material & { opacity: number }).opacity = val1;
        });
      } else if ("opacity" in mat1) {
        (mat1 as THREE.Material & { opacity: number }).opacity = val1;
      }
    }

    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.z = -state.clock.getElapsedTime() * 0.003;
      const mat2 = nebula2Ref.current.material;
      const val2 = 0.08 + Math.cos(state.clock.getElapsedTime() * 0.7) * 0.04;
      if (Array.isArray(mat2)) {
        mat2.forEach((m) => {
          if ("opacity" in m) (m as THREE.Material & { opacity: number }).opacity = val2;
        });
      } else if ("opacity" in mat2) {
        (mat2 as THREE.Material & { opacity: number }).opacity = val2;
      }
    }
  });

  return (
    <group>
      {/* Star field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2000}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
        />
      </points>

      {/* Nebula clouds */}
      <mesh ref={nebula1Ref} position={[-15, 10, -20]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent={true} opacity={0.1} />
      </mesh>

      <mesh ref={nebula2Ref} position={[20, -8, -25]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent={true} opacity={0.08} />
      </mesh>

      {/* Distant galaxy effect */}
      <mesh position={[0, 0, -40]}>
        <ringGeometry args={[8, 12, 64]} />
        <meshBasicMaterial
          color="#16a34a"
          transparent={true}
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
