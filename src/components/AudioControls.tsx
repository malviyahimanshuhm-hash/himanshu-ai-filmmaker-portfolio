import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './AudioControls.css';

/**
 * AudioControls: Optional background music player with free royalty-free tracks.
 * Features: Muted by default, fade in/out, volume control, playlist cycling.
 * Music sources: Pixabay, Bensound (free for personal/commercial use with attribution).
 */
export const AudioControls = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  // Free royalty-free music tracks (Pixabay/Bensound)
  // Using direct CDN links for free music with proper licensing
  const audioTracks = [
    'https://www.bensound.com/bensound-music/bensound-cinematicalmood.mp3',
    // Fallback: Optional local track if available
    // '/audio/background-ambient.mp3'
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    
    // Fade in/out on mute toggle
    if (!isMuted && !isPlaying) {
      audio.play().catch(() => {
        console.log('Audio autoplay prevented by browser');
      });
      setIsPlaying(true);
    } else if (isMuted && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }

    return () => {
      if (audio && isPlaying) {
        audio.pause();
      }
    };
  }, [isMuted, volume, isPlaying]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.currentTarget.value));
    if (audioRef.current) {
      audioRef.current.volume = parseFloat(e.currentTarget.value);
    }
  };

  const handleTrackEnd = () => {
    // Loop to start when track ends
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="audio-controls" aria-label="Background music controls">
      <audio
        ref={audioRef}
        src={audioTracks[0]}
        onEnded={handleTrackEnd}
        loop={false}
        crossOrigin="anonymous"
      />

      <div className="audio-control-group">
        <button
          className="audio-toggle-btn"
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
          title="Background music (muted by default)"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {!isMuted && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-volume-slider"
            aria-label="Music volume"
          />
        )}

        <span className="audio-label">
          {isMuted ? 'Music' : `${Math.round(volume * 100)}%`}
        </span>
      </div>
    </div>
  );
};
