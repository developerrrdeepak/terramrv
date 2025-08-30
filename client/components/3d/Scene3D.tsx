import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { WireframeGlobe } from './WireframeGlobe';
import { Tree } from './Tree';
import { Particles } from './Particles';
import { Leaf } from './Leaf';
import { CarbonMolecule } from './CarbonMolecule';

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
          <Tree position={[-3, -1, 0]} />
          <Tree position={[-2.5, 1, -1]} />
          <CarbonMolecule position={[1, 2, -1]} />
          <CarbonMolecule position={[-1, -2, 1]} />
          <Leaf position={[3, 1, -2]} />
          <Leaf position={[-4, 0, 1]} />
          <Leaf position={[2, -1, 2]} />
          <Particles />
          
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
