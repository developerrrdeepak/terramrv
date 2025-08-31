import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { WireframeGlobe } from "./WireframeGlobe";
import { FloatingDots } from "./FloatingDots";
import { SpaceScene } from "./SpaceScene";

export function Scene3D() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none -z-5">
      <Canvas camera={{ position: [0, 1, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.6}
            color="#16A34A"
          />
          <pointLight position={[5, -5, 10]} intensity={0.4} color="#22C55E" />

          <SpaceScene />
          <WireframeGlobe />
          <FloatingDots />

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
