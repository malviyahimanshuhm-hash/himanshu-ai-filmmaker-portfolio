import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero3D.css';

gsap.registerPlugin(ScrollTrigger);

// Stylized Cinema Camera & Director Rig
const FilmmakerCharacter = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRigRef = useRef<THREE.Group>(null);
  const recLightRef = useRef<THREE.PointLight>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Mouse move listener for subtle camera pan tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current = {
        x: normY * 0.15,
        y: normX * 0.25,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // GSAP scroll trigger for parallax & cinematic rotation
  useEffect(() => {
    const group = groupRef.current;
    if (!group || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(group.rotation, {
        y: -0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(group.position, {
        y: -0.4,
        x: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Frame animation: smooth mouse tracking lerp & pulsing REC light
  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      // Smooth lerp to mouse position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );

      // Subtle breathing idle float
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.04;

      // Pulse red REC indicator
      if (recLightRef.current) {
        recLightRef.current.intensity = 1.2 + Math.sin(t * 4) * 0.8;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* --- Stylized Director Figure --- */}
      <group position={[0, 0, 0]}>
        {/* Head with Director's Cap */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Cinematic Cap Visor */}
        <mesh position={[0, 1.62, 0.18]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.05, 0.32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>

        {/* Headphones on character */}
        <mesh position={[0, 1.48, 0]} castShadow>
          <torusGeometry args={[0.32, 0.04, 16, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.32, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.32, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Torso in Director's Trench / Jacket */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.36, 0.8, 8, 16]} />
          <meshStandardMaterial
            color="#141416"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Warm Gold Scarf / Accent Collar */}
        <mesh position={[0, 1.15, 0.08]} castShadow>
          <torusGeometry args={[0.25, 0.06, 16, 24]} />
          <meshStandardMaterial color="#aa8c2c" roughness={0.5} />
        </mesh>

        {/* Left Arm holding camera */}
        <mesh position={[-0.45, 0.95, 0.25]} rotation={[0.6, 0.2, -0.4]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>

        {/* Right Arm supporting rig */}
        <mesh position={[0.45, 0.95, 0.35]} rotation={[0.7, -0.3, 0.5]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
      </group>

      {/* --- High-End Cinema Camera Rig --- */}
      <group ref={cameraRigRef} position={[0.25, 1.05, 0.65]} rotation={[0.05, -0.25, 0]}>
        {/* Main Camera Body (ARRI / RED inspired) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.38, 0.65]} />
          <meshStandardMaterial
            color="#18191c"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Gold Accent Strip on camera */}
        <mesh position={[0, 0.12, 0.33]}>
          <boxGeometry args={[0.51, 0.03, 0.02]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Matte Box Hood */}
        <mesh position={[0, 0.02, 0.55]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.34, 0.18]} />
          <meshStandardMaterial color="#0d0e10" roughness={0.9} />
        </mesh>

        {/* Cinema Prime Lens Barrel */}
        <mesh position={[0, 0.02, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 24]} />
          <meshStandardMaterial
            color="#222328"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Lens Glass with iridescent film reflection */}
        <mesh position={[0, 0.02, 0.49]}>
          <circleGeometry args={[0.13, 24]} />
          <meshStandardMaterial
            color="#1a2d42"
            metalness={0.95}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Red REC Tally Light */}
        <mesh position={[0.18, 0.14, 0.34]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial color="#ff2a2a" />
        </mesh>
        <pointLight
          ref={recLightRef}
          position={[0.18, 0.14, 0.38]}
          color="#ff2222"
          intensity={1.5}
          distance={1.5}
        />

        {/* Monitor / Viewfinder Display */}
        <mesh position={[-0.32, 0.12, -0.05]} rotation={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.04, 0.22, 0.32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.35, 0.12, -0.05]} rotation={[0, 0.45, 0]}>
          <planeGeometry args={[0.28, 0.18]} />
          <meshBasicMaterial color="#0a2540" />
        </mesh>

        {/* Top Handle */}
        <mesh position={[0, 0.26, -0.05]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.45]} />
          <meshStandardMaterial color="#2d2d30" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Atmospheric Cinema Floor Disc */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.5, 2.2, 32]} />
        <meshStandardMaterial
          color="#0f0f12"
          metalness={0.5}
          roughness={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

export const Hero3D = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Trigger name reveal animation when component mounts
  useEffect(() => {
    const timeline = gsap.timeline();
    
    // Character entrance animation coordinated with 3D
    timeline.fromTo(
      '.filmmaker-character-rig',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
      0
    );

    // Staggered name reveal with character sync
    timeline.fromTo(
      '.hero-title-word',
      { opacity: 0, y: 30, scaleX: 0.9 },
      { opacity: 1, y: 0, scaleX: 1, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.15 },
      0.4
    );

    // Subtitle and tagline follow
    timeline.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0.8
    );

    timeline.fromTo(
      '.hero-tagline',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      1.0
    );

    // Fade in description
    timeline.fromTo(
      '.hero-description',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      1.2
    );

    // Buttons entrance
    timeline.fromTo(
      '.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      1.4
    );
  }, []);

  return (
    <div className="hero-3d-wrapper" aria-hidden="true" ref={canvasRef}>
      <Canvas
        className="hero-3d-canvas"
        camera={{ position: [0, 0.85, 2.5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        {/* Procedural Cinematic Studio Lighting — Zero external CDN network dependencies */}
        <ambientLight intensity={0.65} color="#151722" />

        {/* Warm Golden Key Light */}
        <directionalLight
          position={[3.5, 4, 3]}
          intensity={2.8}
          color="#f4c430"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Cool Cyan Rim Light for Hollywood Contrast */}
        <directionalLight
          position={[-3.5, 3.2, -2]}
          intensity={1.8}
          color="#38bdf8"
        />

        {/* Warm Amber Accent / Under-Glow */}
        <pointLight
          position={[0, 0.2, 1.5]}
          intensity={1.2}
          color="#ffaa00"
          distance={4}
        />

        {/* Top Crisp Overhead Highlight */}
        <pointLight
          position={[0, 4.5, 0.5]}
          intensity={1.0}
          color="#ffffff"
          distance={6}
        />

        <FilmmakerCharacter />
      </Canvas>
    </div>
  );
};
