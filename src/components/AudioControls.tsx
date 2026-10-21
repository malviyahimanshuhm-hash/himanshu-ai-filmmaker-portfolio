import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './AudioControls.css';

interface AudioControlsProps {
  isModalOpen?: boolean;
}

/**
 * AudioControls: Optional background ambient sound generator.
 * Uses Web Audio API to create a gentle, warm cinematic ambient pad.
 * Completely royalty-free, client-side, zero external 403 errors, and zero paid services.
 * Automatically ducks/pauses when a project video modal is open.
 */
export const AudioControls = ({ isModalOpen = false }: AudioControlsProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Start or resume Web Audio cinematic ambient drone
  const startAmbientSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGainRef.current = masterGain;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, ctx.currentTime);

        masterGain.connect(filter);
        filter.connect(ctx.destination);

        // Three warm harmonic oscillators (A1 55Hz, E2 82.4Hz, A2 110Hz)
        const freqs = [55, 82.4, 110];
        const oscs: OscillatorNode[] = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          oscGain.gain.setValueAtTime(0.3 / (idx + 1), ctx.currentTime);

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 1.0);
      }
    } catch {
      // AudioContext fallback
    }
  }, [volume]);

  const stopAmbientSound = useCallback(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.6);
    }
  }, []);

  // Handle mute toggle
  useEffect(() => {
    if (isMuted || isModalOpen) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  }, [isMuted, isModalOpen, startAmbientSound, stopAmbientSound]);

  // Handle volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.currentTarget.value);
    setVolume(newVol);
    if (!isMuted && !isModalOpen && masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  return (
    <div className="audio-controls" aria-label="Background audio controls">
      <div className="audio-control-group">
        <button
          className={`audio-toggle-btn ${!isMuted ? 'active' : ''}`}
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute background cinematic ambiance' : 'Mute background cinematic ambiance'}
          title="Background cinematic ambiance (muted by default)"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {!isMuted && (
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-volume-slider"
            aria-label="Ambient volume"
          />
        )}

        <span className="audio-label">
          {isMuted ? 'Ambiance' : `${Math.round((volume / 0.5) * 100)}%`}
        </span>
      </div>
    </div>
  );
};
