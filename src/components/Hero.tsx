import { Play, ArrowRight } from 'lucide-react';
import { Hero3D } from './Hero3D';
import './Hero.css';

interface HeroProps {
  onWatchShowreel?: () => void;
}

export const Hero = ({ onWatchShowreel }: HeroProps) => {
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
    <section id="hero" className="hero" aria-label="Hero Introduction">
      <Hero3D />

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>AI Filmmaker & Director • Mumbai / Global</span>
          </div>

          <h1 className="hero-title">
            HIMANSHU
            <span className="hero-title-accent"> MALVIYA</span>
          </h1>

          <h2 className="hero-subtitle">
            Cinematic AI Films • Microdramas • Brand Commercials
          </h2>

          <p className="hero-tagline">
            Building the Future of Indian Cinema with Generative AI
          </p>

          <p className="hero-description">
            Pioneering narrative-driven AI filmmaking with uncompromising craft — fusing camera language,
            anamorphic lighting, emotional continuity, and virtual production workflows.
          </p>

          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={handleWatchShowreel}
              aria-label="Watch 2026 Director Showreel"
            >
              <Play size={18} fill="currentColor" />
              Watch Showreel
            </button>
            <a
              href="#work"
              onClick={handleExploreWork}
              className="btn btn-outline"
              aria-label="Explore Selected Projects"
            >
              Explore Selected Work
              <ArrowRight size={18} />
            </a>
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
