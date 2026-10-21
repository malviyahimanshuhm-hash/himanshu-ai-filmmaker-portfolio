import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero3D.css';

gsap.registerPlugin(ScrollTrigger);

interface FilmmakerCharacterProps {
  isEntered: boolean;
}

// Stylized Cinema Camera & Director Rig
const FilmmakerCharacter = ({ isEntered }: FilmmakerCharacterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRigRef = useRef<THREE.Group>(null);
  const recLightRef = useRef<THREE.PointLight>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Entrance slide-in animation from the side
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    if (prefersReducedMotion) {
      group.position.set(0, -0.3, 0);
      group.rotation.set(0, 0, 0);
      return;
    }

    if (isEntered) {
      // Smooth slide into frame from the right side
      gsap.fromTo(
        group.position,
        { x: 3.2, z: -0.5 },
        { x: 0, z: 0, duration: 1.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        group.rotation,
        { y: -0.7 },
        { y: 0, duration: 1.6, ease: 'power3.out' }
      );
    }
  }, [isEntered, prefersReducedMotion]);

  // Mouse move listener for subtle camera pan tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current = {
        x: normY * 0.12,
        y: normX * 0.22,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // GSAP scroll trigger for parallax & upward exit transition
  useEffect(() => {
    const group = groupRef.current;
    if (!group || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Smooth scroll reaction - avatar moves upward and exits hero composition naturally
      gsap.to(group.position, {
        y: 1.8,
        z: -1.2,
        x: 0.6,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(group.rotation, {
        y: -0.5,
        x: 0.1,
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
  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion && isEntered) {
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
      groupRef.current.position.y = -0.3 + Math.sin(t * 1.5) * 0.03;

      // Pulse red REC indicator
      if (recLightRef.current) {
        recLightRef.current.intensity = 1.2 + Math.sin(t * 4) * 0.8;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={[0.88, 0.88, 0.88]}>
      {/* --- Stylized Director Figure --- */}
      <group position={[0, 0, 0]}>
        {/* Head with Director's Cap */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.25}
            roughness={0.55}
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

interface Hero3DProps {
  isEntered?: boolean;
}

export const Hero3D = ({ isEntered = true }: Hero3DProps) => {
  return (
    <div className="hero-3d-wrapper" aria-hidden="true">
      <Canvas
        className="hero-3d-canvas"
        camera={{ position: [0, 0.75, 3.6], fov: 36 }}
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
          gl.toneMappingExposure = 1.15;
        }}
      >
        {/* Procedural Cinematic Studio Lighting — Zero external CDN network dependencies */}
        <ambientLight intensity={1.1} color="#181d2c" />

        {/* Warm Golden Key Light */}
        <directionalLight
          position={[3.5, 4.2, 3]}
          intensity={3.6}
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

        <FilmmakerCharacter isEntered={isEntered} />
      </Canvas>
    </div>
  );
};
