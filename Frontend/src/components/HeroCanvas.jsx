import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const AmbientShapes = () => {
  const mesh1 = useRef();
  const mesh2 = useRef();

  useFrame((state) => {
    // THREE.Timer uses .getElapsed() while Clock uses .getElapsedTime()
    // Providing support for both to be safe
    const clock = state.clock;
    const t =
      clock?.getElapsed?.() ?? clock?.getElapsedTime?.() ?? Date.now() / 1000;

    if (mesh1?.current) {
      mesh1.current.rotation.x = Math.cos(t / 4) / 8;
      mesh1.current.rotation.y = Math.sin(t / 4) / 8;
      mesh1.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    }
  });

  return (
    <>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={mesh1} {...{ position: [2, 1, -2] }}>
          <sphereGeometry {...{ args: [1.5, 64, 64] }} />
          <MeshDistortMaterial
            {...{
              color: "#3b82f6",
              speed: 3,
              distort: 0.4,
              radius: 1,
            }}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh ref={mesh2} {...{ position: [-3, -1, -3] }}>
          <sphereGeometry {...{ args: [1, 64, 64] }} />
          <MeshDistortMaterial
            {...{
              color: "#8b5cf6",
              speed: 5,
              distort: 0.6,
              radius: 1,
            }}
          />
        </mesh>
      </Float>

      <Stars
        {...{
          radius: 100,
          depth: 50,
          count: 5000,
          factor: 4,
          saturation: 0,
          fade: true,
          speed: 1,
        }}
      />
    </>
  );
};

const HeroCanvas = () => {
  // Use THREE.Timer to avoid deprecation warnings in THREE 0.183+
  const timer = useMemo(() => new THREE.Timer(), []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        {...{
          camera: { position: [2, 4, 5], fov: 75 },
          clock: timer,
        }}
      >
        <ambientLight {...{ intensity: 0.5 }} />
        <pointLight {...{ position: [10, 10, 10], intensity: 1 }} />
        <spotLight
          {...{
            position: [-10, 10, 10],
            angle: 0.15,
            penumbra: 1,
            intensity: 1,
          }}
        />
        <AmbientShapes />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
