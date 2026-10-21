import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Film, Clock, Tag } from 'lucide-react';
import { Project } from '../types/project';
import './VideoModal.css';

interface VideoModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ project, isOpen, onClose }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && project?.videoPath) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked without user gesture fallback
          setPlaying(false);
        });
    }
  }, [isOpen, project]);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setPlaying(false);
    onClose();
  }, [onClose]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus modal container
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose, muted]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="video-modal-overlay" 
      onClick={handleClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className="video-modal" 
        ref={modalRef} 
        tabIndex={-1} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="video-modal-header">
          <div className="modal-title-group">
            <span className="modal-category">
              <Tag size={12} />
              {project.categoryLabel || project.category}
            </span>
            <h2 id="modal-title">{project.title}</h2>
          </div>
          <button 
            className="close-btn" 
            onClick={handleClose} 
            aria-label="Close video player"
          >
            <X size={22} />
          </button>
        </div>

        <div className="video-player-container">
          {loading && (
            <div className="video-loading" aria-live="polite">
              <div className="spinner" />
              <p>Loading cinema playback...</p>
            </div>
          )}

          {error && (
            <div className="video-error" role="alert">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={handleClose}>Close</button>
            </div>
          )}

          {project.videoPath && (
            <video
              ref={videoRef}
              src={project.videoPath}
              poster={project.thumbnailPath}
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError('Failed to load video format');
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              muted={muted}
              playsInline
              controls
              className="modal-video"
            />
          )}
        </div>

        <div className="video-modal-info">
          <p className="video-description">{project.description}</p>
          
          <div className="video-meta-grid">
            {project.role && (
              <div className="modal-meta-item">
                <span className="meta-label">Role:</span>
                <span className="meta-value">{project.role}</span>
              </div>
            )}
            {project.credits && (
              <div className="modal-meta-item">
                <span className="meta-label">Credits:</span>
                <span className="meta-value">{project.credits}</span>
              </div>
            )}
            {project.duration && (
              <div className="modal-meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{project.duration}</span>
              </div>
            )}
          </div>

          {project.tools && project.tools.length > 0 && (
            <div className="video-tools-row">
              <span className="tools-label">AI & Production Stack:</span>
              <div className="tools-list">
                {project.tools.map((tool, i) => (
                  <span key={i} className="tool-tag">{tool}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
