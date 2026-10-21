import { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero3D.css';

gsap.registerPlugin(ScrollTrigger);

interface HumanMaleAvatarProps {
  isEntered: boolean;
  isSpeaking: boolean;
}

/**
 * Photorealistic Human Male AI Filmmaker 3D Avatar
 * Loaded from public/models/avatar.glb (11.71 MB)
 * Features 66 facial morph targets (ARKit blendshapes & Oculus Visemes)
 * Configured in tailored black director's wardrobe with warm gold cinematic rim lighting.
 */
const HumanMaleAvatarModel = ({ isEntered, isSpeaking }: HumanMaleAvatarProps) => {
  const { scene } = useGLTF('/models/avatar.glb');
  const groupRef = useRef<THREE.Group>(null);
  const headMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRigRef = useRef<THREE.Group>(null);
  const recLightRef = useRef<THREE.PointLight>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Clone scene and configure tailored black director wardrobe & cast shadows
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Locate head mesh with facial morph targets
        if (mesh.name === 'AvatarHead' && mesh.morphTargetDictionary) {
          headMeshRef.current = mesh;
        }

        // Apply tailored black director's wardrobe style to outfit materials
        if (mesh.name.includes('outfit_top') || mesh.name.includes('outfit_bottom')) {
          if (mesh.material) {
            const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
            mat.color.set('#101014'); // Matte black filmmaker jacket/wardrobe
            mat.roughness = 0.82;
            mat.metalness = 0.12;
            mesh.material = mat;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  // Entrance slide-in animation from the side
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    if (prefersReducedMotion) {
      group.position.set(0, -1.05, 0);
      group.rotation.set(0, 0, 0);
      return;
    }

    if (isEntered) {
      gsap.fromTo(
        group.position,
        { x: 3.2, z: -0.5 },
        { x: 0, z: 0, duration: 1.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        group.rotation,
        { y: -0.65 },
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
        x: normY * 0.1,
        y: normX * 0.18,
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
      gsap.to(group.position, {
        y: 1.2,
        z: -1.2,
        x: 0.5,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(group.rotation, {
        y: -0.4,
        x: 0.08,
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

  // Frame animation: mouth morph targets, natural blinking, idle breathing & mouse tracking
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();

    if (!prefersReducedMotion && isEntered) {
      // 1. Smooth lerp to mouse position
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation.current.y, 0.05);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotation.current.x, 0.05);

      // 2. Subtle breathing idle float
      group.position.y = -1.05 + Math.sin(t * 1.5) * 0.015;

      // 3. Pulse red REC indicator on camera rig
      if (recLightRef.current) {
        recLightRef.current.intensity = 1.2 + Math.sin(t * 4) * 0.8;
      }
    }

    // 4. Facial Blendshapes & Morph Targets (Lip-sync & Blinking)
    const head = headMeshRef.current;
    if (head && head.morphTargetDictionary && head.morphTargetInfluences) {
      const dict = head.morphTargetDictionary;
      const influences = head.morphTargetInfluences;

      // A. Natural Eye Blinking every ~3.5s
      blinkTimer.current += delta;
      if (blinkTimer.current > 3.5) {
        isBlinking.current = true;
        const blinkPhase = (blinkTimer.current - 3.5) / 0.16;
        if (blinkPhase <= 1.0) {
          const blinkVal = Math.sin(blinkPhase * Math.PI);
          if (dict['eyeBlinkLeft'] !== undefined) influences[dict['eyeBlinkLeft']] = blinkVal;
          if (dict['eyeBlinkRight'] !== undefined) influences[dict['eyeBlinkRight']] = blinkVal;
        } else {
          isBlinking.current = false;
          blinkTimer.current = Math.random() * 0.8; // Randomize next blink interval
          if (dict['eyeBlinkLeft'] !== undefined) influences[dict['eyeBlinkLeft']] = 0;
          if (dict['eyeBlinkRight'] !== undefined) influences[dict['eyeBlinkRight']] = 0;
        }
      }

      // B. Lip-Sync & Viseme Speech Animation during Scene 3
      if (isSpeaking) {
        // Natural speech modulation combining visemes & jaw motion
        const speechCadence = Math.sin(t * 12) * 0.5 + 0.5;
        const jawVal = speechCadence * 0.45;
        const visemeVal = (Math.sin(t * 9 + 0.5) * 0.5 + 0.5) * 0.55;
        const smileVal = 0.2;

        if (dict['jawOpen'] !== undefined) {
          influences[dict['jawOpen']] = THREE.MathUtils.lerp(influences[dict['jawOpen']], jawVal, 0.3);
        }
        if (dict['viseme_aa'] !== undefined) {
          influences[dict['viseme_aa']] = THREE.MathUtils.lerp(influences[dict['viseme_aa']], visemeVal, 0.3);
        }
        if (dict['viseme_O'] !== undefined) {
          influences[dict['viseme_O']] = THREE.MathUtils.lerp(influences[dict['viseme_O']], speechCadence * 0.3, 0.3);
        }
        if (dict['mouthSmileLeft'] !== undefined) influences[dict['mouthSmileLeft']] = smileVal;
        if (dict['mouthSmileRight'] !== undefined) influences[dict['mouthSmileRight']] = smileVal;
      } else {
        // Reset mouth smoothly to relaxed smile when not speaking
        if (dict['jawOpen'] !== undefined) {
          influences[dict['jawOpen']] = THREE.MathUtils.lerp(influences[dict['jawOpen']], 0, 0.2);
        }
        if (dict['viseme_aa'] !== undefined) {
          influences[dict['viseme_aa']] = THREE.MathUtils.lerp(influences[dict['viseme_aa']], 0, 0.2);
        }
        if (dict['viseme_O'] !== undefined) {
          influences[dict['viseme_O']] = THREE.MathUtils.lerp(influences[dict['viseme_O']], 0, 0.2);
        }
        if (dict['mouthSmileLeft'] !== undefined) {
          influences[dict['mouthSmileLeft']] = THREE.MathUtils.lerp(influences[dict['mouthSmileLeft']], 0.15, 0.1);
        }
        if (dict['mouthSmileRight'] !== undefined) {
          influences[dict['mouthSmileRight']] = THREE.MathUtils.lerp(influences[dict['mouthSmileRight']], 0.15, 0.1);
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.05, 0]} scale={[0.92, 0.92, 0.92]}>
      {/* 3D Human Male Character Scene */}
      <primitive object={clonedScene} />

      {/* Director's Optical Viewfinder Rig in foreground */}
      <group ref={cameraRigRef} position={[0.22, 1.05, 0.52]} rotation={[0.08, -0.15, 0]}>
        {/* Handheld Viewfinder Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.18, 0.32]} />
          <meshStandardMaterial color="#18191c" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Gold Anodized Mount Ring */}
        <mesh position={[0, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
        </mesh>

        {/* Cinema Prime Lens Barrel */}
        <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.068, 0.068, 0.12, 24]} />
          <meshStandardMaterial color="#24262b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Coated Optical Glass */}
        <mesh position={[0, 0, 0.305]}>
          <circleGeometry args={[0.058, 24]} />
          <meshStandardMaterial color="#15283e" metalness={0.95} roughness={0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* Director's AMOLED Framing Monitor */}
        <mesh position={[0, 0.14, -0.03]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.13, 0.025]} />
          <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.14, -0.016]} rotation={[-0.22, 0, 0]}>
          <planeGeometry args={[0.19, 0.10]} />
          <meshBasicMaterial color="#0b1e33" />
        </mesh>

        {/* Red REC Tally Indicator */}
        <mesh position={[0.10, 0.06, 0.17]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color="#ff2a2a" />
        </mesh>
        <pointLight
          ref={recLightRef}
          position={[0.10, 0.06, 0.20]}
          color="#ff2222"
          intensity={1.2}
          distance={1.2}
        />
      </group>

      {/* Atmospheric Cinema Floor Pedestal */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.4, 2.2, 32]} />
        <meshStandardMaterial color="#0f0f12" metalness={0.5} roughness={0.8} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// Preload the GLB avatar model
useGLTF.preload('/models/avatar.glb');

interface Hero3DProps {
  isEntered?: boolean;
  isSpeaking?: boolean;
}

export const Hero3D = ({ isEntered = true, isSpeaking = false }: Hero3DProps) => {
  return (
    <div className="hero-3d-wrapper" aria-hidden="true">
      <Canvas
        className="hero-3d-canvas"
        camera={{ position: [0, 0.75, 3.2], fov: 36 }}
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
        {/* Procedural Cinematic Studio Lighting — Calibrated for Human Filmmaker Avatar */}
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

        {/* Cool Cyan Ambient Shadow Fill for Hollywood Contrast */}
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

        <Suspense fallback={null}>
          <HumanMaleAvatarModel isEntered={isEntered} isSpeaking={isSpeaking} />
        </Suspense>
      </Canvas>
    </div>
  );
};
