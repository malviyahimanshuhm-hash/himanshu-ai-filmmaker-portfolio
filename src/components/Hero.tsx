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
/**
 * Configurable Audio & Voice parameters for the Hero Cinematic Intro
 */
export const HERO_AUDIO_CONFIG = {
  musicSrc: '/audio/heroic-intro.mp3',
  spokenLine: "Hi, I’m Himanshu, and I’m a professional AI filmmaker.",
  musicVolumeNormal: 0.65,
  musicVolumeDucked: 0.16,
  voiceVolume: 1.0,
  voiceSpeechRate: 0.92,
  voiceSpeechPitch: 0.96,
  speechDelayMs: 2000,
};

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
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const duckIntervalRef = useRef<number | null>(null);

  // Safely stop intro music and clear active timers
  const stopIntroMusic = useCallback(() => {
    if (duckIntervalRef.current) {
      window.clearInterval(duckIntervalRef.current);
      duckIntervalRef.current = null;
    }
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
      musicAudioRef.current = null;
    }
  }, []);

  // Smoothly ramp music volume up or down (for ducking under speech and restoration)
  const rampMusicVolume = useCallback((targetVol: number, durationMs: number = 350) => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    if (duckIntervalRef.current) {
      window.clearInterval(duckIntervalRef.current);
      duckIntervalRef.current = null;
    }
    const startVol = audio.volume;
    const steps = 14;
    const stepTime = durationMs / steps;
    const volDiff = targetVol - startVol;
    let currentStep = 0;

    duckIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, startVol + volDiff * progress));
      }
      if (currentStep >= steps) {
        if (duckIntervalRef.current) {
          window.clearInterval(duckIntervalRef.current);
          duckIntervalRef.current = null;
        }
      }
    }, stepTime);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopIntroMusic();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopIntroMusic]);

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

  // Play subtle cinematic low-frequency sub-bass chord fallback
  const playCinematicSoundAccent = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2);

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

  // Start the interactive sequence with heroic entrance music and ducked voice
  const startSequence = (withSound: boolean) => {
    // Prevent overlapping audio from repeated triggers
    stopIntroMusic();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setSoundEnabled(withSound);

    if (withSound) {
      // 1. Play heroic music cue in response to user gesture
      try {
        const audio = new Audio(HERO_AUDIO_CONFIG.musicSrc);
        audio.volume = HERO_AUDIO_CONFIG.musicVolumeNormal;
        musicAudioRef.current = audio;
        audio.play().catch((err) => {
          console.warn('Hero entrance music fallback:', err);
          playCinematicSoundAccent();
        });

        // Automatically fade out music as intro completes
        setTimeout(() => {
          rampMusicVolume(0, 2200);
        }, 13000);
      } catch (err) {
        console.warn('Audio initialization error:', err);
      }
    }

    setIntroStage('cinematic_opening');

    // Scene 2: Avatar Entrance (slide in from side)
    setTimeout(() => {
      setIntroStage('avatar_entering');
    }, 700);

    // Scene 3: Spoken Introduction with ducking
    setTimeout(() => {
      setIntroStage('speaking');
      setSubtitleText(HERO_AUDIO_CONFIG.spokenLine);

      if (withSound) {
        // Automatically lower music volume under speech
        rampMusicVolume(HERO_AUDIO_CONFIG.musicVolumeDucked, 350);

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const utterance = new SpeechSynthesisUtterance(HERO_AUDIO_CONFIG.spokenLine);
            utterance.rate = HERO_AUDIO_CONFIG.voiceSpeechRate;
            utterance.pitch = HERO_AUDIO_CONFIG.voiceSpeechPitch;
            utterance.lang = 'en-US';
            utterance.volume = HERO_AUDIO_CONFIG.voiceVolume;

            const voices = window.speechSynthesis.getVoices();
            const natural = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David')) && v.lang.startsWith('en'));
            if (natural) utterance.voice = natural;

            // When speech ends: restore music volume!
            utterance.onend = () => {
              rampMusicVolume(0.55, 450);
            };
            utterance.onerror = () => {
              rampMusicVolume(0.55, 300);
            };

            speechRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          } catch {
            rampMusicVolume(0.55, 300);
          }
        }
      }
    }, HERO_AUDIO_CONFIG.speechDelayMs);

    // Scene 4: Full Typography Reveal
    setTimeout(() => {
      setIntroStage('revealed');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('himanshu_intro_seen', 'true');
      }
    }, 5000);
  };

  const skipIntro = () => {
    stopIntroMusic();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIntroStage('revealed');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('himanshu_intro_seen', 'true');
    }
  };

  const toggleSoundAfterIntro = () => {
    if (soundEnabled) {
      stopIntroMusic();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      try {
        const audio = new Audio(HERO_AUDIO_CONFIG.musicSrc);
        audio.volume = 0.45;
        musicAudioRef.current = audio;
        audio.play().catch(() => {});
      } catch {}
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
      {/* 3D Canvas Avatar with corrected framing, entrance slide, and facial morph targets */}
      <Hero3D isEntered={introStage !== 'prompt'} isSpeaking={introStage === 'speaking'} />

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

      {/* Visible Hero Sound Toggle Button */}
      {introStage === 'revealed' && (
        <button
          className="hero-sound-toggle-btn"
          onClick={toggleSoundAfterIntro}
          aria-label={soundEnabled ? "Mute Hero Audio" : "Play Hero Theme"}
          title={soundEnabled ? "Mute Hero Theme" : "Play Hero Theme"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? "Theme On" : "Theme Off"}</span>
        </button>
      )}

      <div className="scroll-indicator" aria-hidden="true">
        <span></span>
        <span className="scroll-text">SCROLL</span>
      </div>
    </section>
  );
};
