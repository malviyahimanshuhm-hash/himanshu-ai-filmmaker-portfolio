import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Sparkles, Award } from 'lucide-react';
import { Project } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';
import './Showreel.css';

interface ShowreelProps {
  onProjectSelect?: (project: Project) => void;
}

export const Showreel = ({ onProjectSelect }: ShowreelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('01:30');
  const [isInView, setIsInView] = useState(false);

  // Use the master showreel project or the first featured project
  const featuredReel: Project = MOCK_PROJECTS.find(p => p.id === 'master-showreel-2026') || MOCK_PROJECTS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Autoplay when scrolled into view (muted), pause when scrolled out
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            video.play().then(() => setIsPlaying(true)).catch(() => {
              // Autoplay policy fallback
            });
          } else {
            setIsInView(false);
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct);
    setCurrentTime(formatTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setDuration(formatTime(video.duration));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  return (
    <section id="showreel" className="showreel-section" aria-label="Cinematic Showreel">
      <div className="showreel-container">
        <div className="section-header">
          <div className="section-tag">
            <Film size={15} />
            <span>DIRECTOR'S REEL</span>
          </div>
          <h2 className="section-title">2026 Showreel</h2>
          <p className="section-subtitle">
            A montage of AI direction, cinematic lighting, prompt engineering, and visual storytelling.
          </p>
        </div>

        <div className="showreel-player-wrapper" ref={containerRef}>
          <div className="cinema-screen">
            <video
              ref={videoRef}
              src={featuredReel.videoPath}
              poster={featuredReel.thumbnailPath}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="showreel-video"
              onClick={togglePlay}
            />

            {/* Ambient Cinema Glow backdrop */}
            <div className="cinema-glow" aria-hidden="true" />

            {/* Center Play Overlay Button (visible when paused) */}
            {!isPlaying && (
              <button
                className="big-play-btn"
                onClick={togglePlay}
                aria-label="Play Showreel"
              >
                <div className="play-pulse-ring" />
                <Play size={36} fill="#0a0a0c" />
              </button>
            )}

            {/* Custom Cinema Controls Bar */}
            <div className="cinema-controls" role="toolbar" aria-label="Video Controls">
              {/* Progress Scrub Bar */}
              <div 
                className="progress-bar-container" 
                onClick={handleSeek}
                role="slider"
                aria-label="Video Progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
              >
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                    <span className="progress-scrubber" />
                  </div>
                </div>
              </div>

              <div className="controls-row">
                <div className="controls-left">
                  <button
                    className="ctrl-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                  </button>

                  <button
                    className="ctrl-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <span className="time-display" aria-live="off">
                    {currentTime} / {duration}
                  </span>
                </div>

                <div className="controls-right">
                  <span className="cinema-badge">4K AI DIRECTED</span>
                  <button
                    className="ctrl-btn"
                    onClick={toggleFullscreen}
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Showreel Specs & Highlights */}
          <div className="showreel-meta">
            <div className="meta-pill">
              <Sparkles size={16} />
              <span>Camera Language & Anamorphic Framing</span>
            </div>
            <div className="meta-pill">
              <Award size={16} />
              <span>Character Consistency & Visual Continuity</span>
            </div>
            <div className="meta-pill">
              <Film size={16} />
              <span>Indian Cinema Meets Generative AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
