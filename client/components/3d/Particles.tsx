import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particleCount = 50;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        speed: Math.random() * 0.02 + 0.005,
        factor: Math.random() * 100 + 10
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const { position, speed, factor } = particle;
        const t = state.clock.getElapsedTime();
        
        dummy.position.set(
          position[0] + Math.sin(t * speed + factor) * 0.3,
          position[1] + Math.cos(t * speed + factor) * 0.3,
          position[2]
        );
        
        dummy.scale.setScalar(Math.sin(t * speed + factor) * 0.3 + 0.7);
        dummy.updateMatrix();
        
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="#10b981" opacity={0.6} transparent />
    </instancedMesh>
  );
}
