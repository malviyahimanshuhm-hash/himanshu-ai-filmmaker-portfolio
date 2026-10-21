import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, ArrowRight, Volume2, VolumeX, Sparkles, Film } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero3D } from './Hero3D';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onWatchShowreel?: () => void;
}

// Spoken introduction string specified in Master Implementation Specification
const INTRO_SPOKEN_LINE = "Hi, I’m Himanshu, and I’m a professional AI filmmaker.";

export const Hero = ({ onWatchShowreel }: HeroProps) => {
  // Session storage check so intro doesn't force-replay on repeated scrolls
  const hasSeenIntroInitial = typeof window !== 'undefined' && sessionStorage.getItem('himanshu_intro_seen') === 'true';
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [introStage, setIntroStage] = useState<'prompt' | 'cinematic_opening' | 'avatar_entering' | 'speaking' | 'revealed'>(
    hasSeenIntroInitial || prefersReducedMotion ? 'revealed' : 'prompt'
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Phase 2: Title and hero content progressively exit upward on scroll
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom 25%',
          scrub: 1.2,
        },
        opacity: 0,
        y: -90,
        scale: 0.96,
        ease: 'power1.out',
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Play subtle cinematic low-frequency sub-bass chord using native Web Audio API (zero external assets/cost)
  const playCinematicSoundAccent = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1 (55Hz)
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2); // Warm swell to A2 (110Hz)

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.3);
    } catch {
      // AudioContext fallback
    }
  }, []);

  // Native Speech Synthesis for the spoken introduction
  const speakIntroduction = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(INTRO_SPOKEN_LINE);
      utterance.rate = 0.92;
      utterance.pitch = 0.98;
      utterance.lang = 'en-US';

      // Pick natural or English voice if available
      const voices = window.speechSynthesis.getVoices();
      const natural = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David')) && v.lang.startsWith('en'));
      if (natural) utterance.voice = natural;

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback if synthesis restricted
    }
  }, []);

  // Start the interactive sequence
  const startSequence = (withSound: boolean) => {
    setSoundEnabled(withSound);
    if (withSound) {
      playCinematicSoundAccent();
    }

    setIntroStage('cinematic_opening');

    // Scene 2: Avatar Entrance (slide in from side)
    setTimeout(() => {
      setIntroStage('avatar_entering');
    }, 700);

    // Scene 3: Spoken Introduction
    setTimeout(() => {
      setIntroStage('speaking');
      setSubtitleText(INTRO_SPOKEN_LINE);
      if (withSound) {
        speakIntroduction();
      }
    }, 1800);

    // Scene 4: Typography reveal & finalize
    setTimeout(() => {
      setIntroStage('revealed');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('himanshu_intro_seen', 'true');
      }
    }, 4600);
  };

  const skipIntro = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIntroStage('revealed');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('himanshu_intro_seen', 'true');
    }
  };

  const handleWatchShowreel = () => {
    if (onWatchShowreel) {
      onWatchShowreel();
    } else {
      const showreelEl = document.getElementById('showreel');
      showreelEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const workEl = document.getElementById('work');
    workEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={`hero ${introStage !== 'revealed' ? 'hero-cinematic-mode' : ''}`} aria-label="Hero Introduction">
      {/* 3D Canvas Avatar with corrected framing and entrance slide */}
      <Hero3D isEntered={introStage !== 'prompt'} />

      {/* Cinematic Letterbox Bars */}
      <div className={`cinema-letterbox letterbox-top ${introStage === 'revealed' ? 'letterbox-hide' : ''}`} aria-hidden="true" />
      <div className={`cinema-letterbox letterbox-bottom ${introStage === 'revealed' ? 'letterbox-hide' : ''}`} aria-hidden="true" />

      {/* --- SCENE 1: Interactive Entrance Prompt --- */}
      {introStage === 'prompt' && (
        <div className="hero-intro-overlay" role="dialog" aria-label="Enter cinematic intro">
          <div className="intro-prompt-card">
            <div className="prompt-badge">
              <Film size={14} />
              <span>DIRECTOR'S PREMIERE</span>
            </div>
            <h2 className="prompt-title">HIMANSHU MALVIYA</h2>
            <p className="prompt-subtitle">Cinematic AI Filmmaker Experience</p>

            <div className="prompt-actions">
              <button
                className="btn btn-primary prompt-enter-btn"
                onClick={() => startSequence(true)}
                aria-label="Enter with sound enabled"
              >
                <Volume2 size={18} />
                <span>Enter With Sound</span>
              </button>

              <button
                className="btn btn-outline prompt-silent-btn"
                onClick={() => startSequence(false)}
                aria-label="Enter in silent mode"
              >
                <VolumeX size={18} />
                <span>Enter Silently</span>
              </button>
            </div>

            <button className="prompt-skip-btn" onClick={skipIntro}>
              Skip Directly to Portfolio →
            </button>
          </div>
        </div>
      )}

      {/* --- SCENE 3: Spoken Subtitle Banner --- */}
      {introStage === 'speaking' && (
        <div className="hero-speech-container" role="status" aria-live="polite">
          <div className="hero-speech-badge">
            <span className="speech-pulse-dot" />
            <p className="hero-speech-text">{subtitleText}</p>
          </div>
          <button className="speech-skip-btn" onClick={skipIntro} aria-label="Skip introduction">
            Skip Intro
          </button>
        </div>
      )}

      {/* --- SCENE 4: Full Typography Reveal --- */}
      <div className={`hero-container ${introStage === 'revealed' ? 'hero-revealed' : 'hero-hidden'}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>AI Filmmaker & Director • Bhopal / Global</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-word">HIMANSHU</span>
          </h1>

          <h2 className="hero-subtitle">
            AI FILMMAKER
          </h2>

          <p className="hero-tagline">
            “My Frames. My Stories. My Direction.”
          </p>

          <p className="hero-subtagline">
            Building the Future of Indian Cinema with Generative AI
          </p>

          <p className="hero-description">
            Pioneering narrative-driven AI filmmaking with uncompromising craft — fusing camera language,
            anamorphic lighting, emotional continuity, and virtual production workflows.
          </p>

          <div className="hero-cta">
            <a
              href="#work"
              onClick={handleExploreWork}
              className="btn btn-primary"
              aria-label="Explore Selected Work"
            >
              Explore Selected Work
              <ArrowRight size={18} />
            </a>
            <button
              className="btn btn-outline"
              onClick={handleWatchShowreel}
              aria-label="Watch 2026 Director Showreel"
            >
              <Play size={18} fill="currentColor" />
              Watch 2026 Reel
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="stat-number">4K+</span>
              <span className="stat-label">AI Frames Directed</span>
            </div>
            <div className="hero-stat-separator" aria-hidden="true">•</div>
            <div className="hero-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Original Workflows</span>
            </div>
            <div className="hero-stat-separator" aria-hidden="true">•</div>
            <div className="hero-stat-item">
              <span className="stat-number">2026</span>
              <span className="stat-label">Reel Released</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <span></span>
        <span className="scroll-text">SCROLL</span>
      </div>
    </section>
  );
};
