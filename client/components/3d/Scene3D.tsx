import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { WireframeGlobe } from "./WireframeGlobe";
import { FloatingDots } from "./FloatingDots";

export function Scene3D() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 1, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.6}
            color="#16A34A"
          />
          <pointLight position={[5, -5, 10]} intensity={0.4} color="#22C55E" />

          <WireframeGlobe />
          <FloatingDots />

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
