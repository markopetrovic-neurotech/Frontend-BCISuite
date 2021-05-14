/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Brain from './Spineless';
import { OrbitControls } from '@react-three/drei';
import './Canvas.css';

export default function BrainCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <OrbitControls autoRotate />
      <Suspense fallback={null}>
        <Brain />
      </Suspense>
    </Canvas>
  );
}
