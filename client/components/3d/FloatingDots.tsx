import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particleCount = 30;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      temp.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        ],
        speed: Math.random() * 0.01 + 0.005,
        factor: Math.random() * 100 + 10,
        scale: Math.random() * 0.5 + 0.3,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const { position, speed, factor, scale } = particle;
        const t = state.clock.getElapsedTime();

        dummy.position.set(
          position[0] + Math.sin(t * speed + factor) * 0.2,
          position[1] + Math.cos(t * speed + factor) * 0.2,
          position[2] + Math.sin(t * speed * 0.5 + factor) * 0.2,
        );

        const pulseScale = scale * (1 + Math.sin(t * 3 + factor) * 0.3);
        dummy.scale.setScalar(pulseScale);
        dummy.updateMatrix();

        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particleCount]}
      position={[2, 0, 0]}
    >
      <sphereGeometry args={[0.03]} />
      <meshBasicMaterial color="#22C55E" transparent opacity={0.8} />
    </instancedMesh>
  );
}
