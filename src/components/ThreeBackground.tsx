import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedPoints() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate random points in 3D space
  const particleCount = 1000;
  const particlesPosition = new Float32Array(particleCount * 3); // 3 coordinates per particle
  
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    
    particlesPosition[i * 3] = x;     // x coordinate
    particlesPosition[i * 3 + 1] = y; // y coordinate  
    particlesPosition[i * 3 + 2] = z; // z coordinate
  }

  useFrame((state) => {
    const { clock } = state;
    if (ref.current) {
      // Rotate the entire point cloud
      ref.current.rotation.x = clock.getElapsedTime() * 0.05;
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      
      // Add mouse interaction
      ref.current.rotation.x += mouse.current.y * 0.0001;
      ref.current.rotation.y += mouse.current.x * 0.0001;
    }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="hsl(var(--primary))"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={orbsRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 3,
            Math.sin(Date.now() * 0.001 + i) * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * 3,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial 
            color="hsl(var(--accent))" 
            transparent 
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100vh'
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <AnimatedPoints />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
};