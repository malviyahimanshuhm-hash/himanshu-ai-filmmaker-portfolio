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
    <group ref={groupRef} position={[0, -0.42, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* --- STYLIZED HUMAN MALE FILMMAKER CHARACTER --- */}
      <group position={[0, 0, 0]}>
        {/* === HEAD & FACIAL STRUCTURE === */}
        {/* 1. Cranium / Head Base (natural human head proportions) */}
        <mesh position={[0, 1.48, 0]} scale={[0.88, 1.05, 0.95]} castShadow>
          <sphereGeometry args={[0.27, 32, 32]} />
          <meshStandardMaterial
            color="#c68a64"
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>

        {/* 2. Sculpted Human Jaw & Chin */}
        <mesh position={[0, 1.28, 0.08]} rotation={[0.22, 0, 0]} scale={[0.88, 1, 1]} castShadow>
          <cylinderGeometry args={[0.21, 0.14, 0.22, 16]} />
          <meshStandardMaterial
            color="#c68a64"
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>
        {/* Chin Prominence */}
        <mesh position={[0, 1.21, 0.17]} castShadow>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>

        {/* 3. Designer Stubble / Short Groomed Beard along jawline */}
        <mesh position={[0, 1.24, 0.09]} rotation={[0.2, 0, 0]} scale={[0.91, 1.03, 1.04]}>
          <cylinderGeometry args={[0.215, 0.145, 0.20, 16]} />
          <meshStandardMaterial
            color="#221e1b"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* 4. Natural Stylized Human Eyes */}
        {/* Left Eye Sclera */}
        <mesh position={[-0.088, 1.50, 0.23]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#f6f3ee" roughness={0.15} />
        </mesh>
        {/* Left Eye Iris (warm amber brown) */}
        <mesh position={[-0.088, 1.50, 0.264]}>
          <circleGeometry args={[0.021, 16]} />
          <meshStandardMaterial color="#4a2c17" roughness={0.1} metalness={0.15} />
        </mesh>
        {/* Left Eye Pupil */}
        <mesh position={[-0.088, 1.50, 0.266]}>
          <circleGeometry args={[0.01, 16]} />
          <meshBasicMaterial color="#080808" />
        </mesh>
        {/* Left Eyebrow (focused, determined filmmaker gaze) */}
        <mesh position={[-0.092, 1.56, 0.245]} rotation={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.082, 0.018, 0.03]} />
          <meshStandardMaterial color="#1c1815" roughness={0.7} />
        </mesh>

        {/* Right Eye Sclera */}
        <mesh position={[0.088, 1.50, 0.23]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#f6f3ee" roughness={0.15} />
        </mesh>
        {/* Right Eye Iris (warm amber brown) */}
        <mesh position={[0.088, 1.50, 0.264]}>
          <circleGeometry args={[0.021, 16]} />
          <meshStandardMaterial color="#4a2c17" roughness={0.1} metalness={0.15} />
        </mesh>
        {/* Right Eye Pupil */}
        <mesh position={[0.088, 1.50, 0.266]}>
          <circleGeometry args={[0.01, 16]} />
          <meshBasicMaterial color="#080808" />
        </mesh>
        {/* Right Eyebrow */}
        <mesh position={[0.092, 1.56, 0.245]} rotation={[0, 0, -0.12]} castShadow>
          <boxGeometry args={[0.082, 0.018, 0.03]} />
          <meshStandardMaterial color="#1c1815" roughness={0.7} />
        </mesh>

        {/* 5. Sculpted Human Nose */}
        <mesh position={[0, 1.45, 0.25]} rotation={[0.18, 0, 0]} castShadow>
          <coneGeometry args={[0.032, 0.13, 8]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.39, 0.28]} castShadow>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>

        {/* 6. Sculpted Human Mouth & Lips */}
        {/* Upper Lip */}
        <mesh position={[0, 1.32, 0.24]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.075, 0.015, 0.025]} />
          <meshStandardMaterial color="#9c6456" roughness={0.5} />
        </mesh>
        {/* Lower Lip */}
        <mesh position={[0, 1.295, 0.238]}>
          <boxGeometry args={[0.068, 0.018, 0.028]} />
          <meshStandardMaterial color="#9c6456" roughness={0.5} />
        </mesh>

        {/* 7. Human Ears */}
        <mesh position={[-0.245, 1.48, -0.01]} rotation={[0, -0.2, 0.1]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>
        <mesh position={[0.245, 1.48, -0.01]} rotation={[0, 0.2, -0.1]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>

        {/* 8. Stylized Modern Filmmaker Hair (Textured Undercut & Volume) */}
        {/* Top Swept Volume */}
        <mesh position={[0, 1.73, 0.02]} rotation={[-0.15, 0, 0]} scale={[1, 0.45, 1.15]} castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#1a1714" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Front Quiff Volume */}
        <mesh position={[0, 1.74, 0.14]} rotation={[0.3, 0, 0]} scale={[0.88, 0.45, 0.6]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#1a1714" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Left Hair Fade / Taper */}
        <mesh position={[-0.21, 1.62, 0.02]} scale={[0.4, 0.8, 1.0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#141210" roughness={0.7} />
        </mesh>
        {/* Right Hair Fade / Taper */}
        <mesh position={[0.21, 1.62, 0.02]} scale={[0.4, 0.8, 1.0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#141210" roughness={0.7} />
        </mesh>
        {/* Back Hair Volume */}
        <mesh position={[0, 1.54, -0.17]} scale={[0.9, 0.9, 0.6]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#141210" roughness={0.7} />
        </mesh>

        {/* === NECK & ANATOMICAL UPPER BODY === */}
        {/* 9. Human Neck with Adam's Apple definition */}
        <mesh position={[0, 1.12, 0.02]} castShadow>
          <cylinderGeometry args={[0.11, 0.135, 0.20, 16]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>
        {/* Adam's apple */}
        <mesh position={[0, 1.14, 0.13]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>

        {/* 10. Wardrobe: Black High-Neck Turtleneck & Tailored Director's Jacket */}
        {/* Turtleneck Collar */}
        <mesh position={[0, 1.03, 0.02]} castShadow>
          <cylinderGeometry args={[0.142, 0.155, 0.12, 18]} />
          <meshStandardMaterial color="#111114" roughness={0.85} />
        </mesh>
        {/* Torso / Blazer Body (Masculine V-Taper) */}
        <mesh position={[0, 0.58, 0.02]} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.28, 0.85, 20]} />
          <meshStandardMaterial
            color="#141418"
            roughness={0.8}
            metalness={0.12}
          />
        </mesh>
        {/* Blazer Lapel Left Fold */}
        <mesh position={[-0.12, 0.76, 0.20]} rotation={[0.1, -0.2, -0.15]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.04]} />
          <meshStandardMaterial color="#101012" roughness={0.8} />
        </mesh>
        {/* Blazer Lapel Right Fold */}
        <mesh position={[0.12, 0.76, 0.20]} rotation={[0.1, 0.2, 0.15]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.04]} />
          <meshStandardMaterial color="#101012" roughness={0.8} />
        </mesh>
        {/* Gold Lapel Director's Crest / Pin */}
        <mesh position={[-0.18, 0.82, 0.22]}>
          <boxGeometry args={[0.03, 0.04, 0.015]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* 11. Natural Human Shoulders & Arms */}
        {/* Left Shoulder */}
        <mesh position={[-0.38, 0.88, 0.02]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#141418" roughness={0.8} />
        </mesh>
        {/* Left Arm (angled gracefully toward director's viewfinder) */}
        <mesh position={[-0.32, 0.68, 0.18]} rotation={[0.7, 0.2, -0.35]} castShadow>
          <capsuleGeometry args={[0.085, 0.42, 6, 12]} />
          <meshStandardMaterial color="#141418" roughness={0.8} />
        </mesh>
        {/* Left Hand holding viewfinder grip */}
        <mesh position={[-0.18, 0.78, 0.46]} castShadow>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>

        {/* Right Shoulder */}
        <mesh position={[0.38, 0.88, 0.02]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#141418" roughness={0.8} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.30, 0.66, 0.22]} rotation={[0.65, -0.25, 0.35]} castShadow>
          <capsuleGeometry args={[0.085, 0.42, 6, 12]} />
          <meshStandardMaterial color="#141418" roughness={0.8} />
        </mesh>
        {/* Right Hand supporting bottom */}
        <mesh position={[0.14, 0.72, 0.44]} castShadow>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshStandardMaterial color="#c68a64" roughness={0.65} />
        </mesh>
      </group>

      {/* === DIRECTOR'S PROFESSIONAL OPTICAL VIEWFINDER & MONITOR RIG === */}
      <group ref={cameraRigRef} position={[0, 0.84, 0.52]} rotation={[0.08, -0.12, 0]}>
        {/* Sleek Handheld Director's Viewfinder Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.20, 0.34]} />
          <meshStandardMaterial
            color="#18191c"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Gold Anodized Lens Mount Ring */}
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.04, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
        </mesh>

        {/* Optical Cinema Prime Lens Barrel */}
        <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.14, 24]} />
          <meshStandardMaterial
            color="#24262b"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Viewfinder Lens Glass Element (Deep Blue Film Coating) */}
        <mesh position={[0, 0, 0.335]}>
          <circleGeometry args={[0.065, 24]} />
          <meshStandardMaterial
            color="#15283e"
            metalness={0.95}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Compact AMOLED Director's OLED Monitor on top */}
        <mesh position={[0, 0.15, -0.04]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.03]} />
          <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Monitor Screen Glowing Film Frame */}
        <mesh position={[0, 0.15, -0.024]} rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.21, 0.11]} />
          <meshBasicMaterial color="#0b1e33" />
        </mesh>

        {/* Red REC Tally Indicator */}
        <mesh position={[0.11, 0.07, 0.18]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#ff2a2a" />
        </mesh>
        <pointLight
          ref={recLightRef}
          position={[0.11, 0.07, 0.22]}
          color="#ff2222"
          intensity={1.2}
          distance={1.2}
        />
      </group>

      {/* Atmospheric Cinema Floor Pedestal */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.4, 2.0, 32]} />
        <meshStandardMaterial
          color="#0f0f12"
          metalness={0.5}
          roughness={0.8}
          transparent
          opacity={0.3}
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
        {/* Procedural Cinematic Studio Lighting — Calibrated for Stylized Human Filmmaker */}
        <ambientLight intensity={1.2} color="#161a24" />

        {/* Soft Warm Key Light (sculpting facial geometry, cheekbones and jawline) */}
        <directionalLight
          position={[2.5, 2.5, 3.2]}
          intensity={2.8}
          color="#fff2df"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Powerful Warm-Gold Rim Light (casting golden halo along hair silhouette & shoulders) */}
        <directionalLight
          position={[-3.2, 2.8, -1.8]}
          intensity={4.5}
          color="#f4c430"
        />

        {/* Secondary Gold Edge Fill */}
        <directionalLight
          position={[3.0, 1.8, -2.0]}
          intensity={2.2}
          color="#d4af37"
        />

        {/* Cool Cyan Ambient Shadow Fill for Hollywood Anamorphic Contrast */}
        <pointLight
          position={[0, 0.4, 2.2]}
          intensity={1.0}
          color="#38bdf8"
          distance={5}
        />

        {/* Overhead Subtle Hair Highlight */}
        <pointLight
          position={[0, 3.8, 0.2]}
          intensity={1.4}
          color="#ffe8a3"
          distance={5}
        />

        <FilmmakerCharacter isEntered={isEntered} />
      </Canvas>
    </div>
  );
};
