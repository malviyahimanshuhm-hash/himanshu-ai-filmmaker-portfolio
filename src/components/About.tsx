import { Award, Camera, Film, Sparkles } from 'lucide-react';
import './About.css';

export const About = () => {
  return (
    <section id="about" className="about" aria-label="About Himanshu">
      <div className="about-container">
        <div className="about-content">
          <div className="about-image-column">
            <div className="about-image-frame">
              <img
                src="/images/thumb-herbvia-picking.jpg"
                alt="Himanshu Malviya Cinematic AI Direction"
                className="about-portrait-img"
              />
              <div className="portrait-cinematic-overlay" aria-hidden="true" />
              <div className="portrait-badge">
                <Sparkles size={16} />
                <span>AI Cinema Pioneer</span>
              </div>
            </div>

            <div className="about-accolades">
              <div className="accolade-item">
                <Film size={20} />
                <div>
                  <h4>Narrative AI</h4>
                  <p>Long & short-form fiction</p>
                </div>
              </div>
              <div className="accolade-item">
                <Camera size={20} />
                <div>
                  <h4>Virtual Cinematography</h4>
                  <p>Anamorphic lighting & optics</p>
                </div>
              </div>
              <div className="accolade-item">
                <Award size={20} />
                <div>
                  <h4>Brand Commercials</h4>
                  <p>High-concept client campaigns</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-text">
            <div className="section-tag">
              <Sparkles size={15} />
              <span>THE VISION</span>
            </div>

            <h2 className="about-heading">
              About <span>Himanshu</span>
            </h2>

            <p className="about-lead">
              I am an AI filmmaker and director committed to architecting the next era of Indian Cinema 
              using generative artificial intelligence.
            </p>

            <p>
              Rather than treating AI as a mere novelty generator, I approach every shot with the deep, 
              disciplined craft of traditional cinema: intentional camera placement, character consistency, 
              nuanced emotional pacing, and painterly light sculpturing.
            </p>

            <p>
              My portfolio bridges dramatic microdramas, cinematic narrative films, and commercial advertising. 
              By combining proprietary prompt architectures with advanced latent-motion tools (Runway, Midjourney, 
              ComfyUI, DaVinci Resolve), I bring complex cinematic visions to life at unprecedented velocity.
            </p>

            <div className="skills-section">
              <h3 className="skills-title">Core Directorial Pillars</h3>
              <div className="skills-grid">
                <div className="skill-item">
                  <span className="skill-dot" />
                  Cinematic Storytelling & Scripts
                </div>
                <div className="skill-item">
                  <span className="skill-dot" />
                  AI Camera Language & Blocking
                </div>
                <div className="skill-item">
                  <span className="skill-dot" />
                  Character Consistency & Latent Seeds
                </div>
                <div className="skill-item">
                  <span className="skill-dot" />
                  Anamorphic Lighting & Color Grading
                </div>
                <div className="skill-item">
                  <span className="skill-dot" />
                  Microdrama Production Workflows
                </div>
                <div className="skill-item">
                  <span className="skill-dot" />
                  Multi-Pass VFX & Sound Design
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
