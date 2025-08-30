import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { WireframeGlobe } from './WireframeGlobe';

export function Scene3D() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ade80" />
          <pointLight position={[5, -5, 10]} intensity={0.3} color="#22d3ee" />
          
          <WireframeGlobe />
          
          <Environment preset="forest" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
