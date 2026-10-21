import { useEffect, useRef } from 'react';
import { Camera, Sparkles, Palette, Layers, Zap, Volume2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philosophy.css';

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHY_ITEMS = [
  {
    icon: Camera,
    title: 'Camera Language',
    description: 'Every shot tells a story. I apply professional camera angles, movement, and framing to create dynamic visual narratives that engage viewers.',
  },
  {
    icon: Sparkles,
    title: 'AI Generation',
    description: 'Leveraging cutting-edge AI tools to bring ideas to life while maintaining creative control over the output through carefully crafted prompts.',
  },
  {
    icon: Palette,
    title: 'Lighting & Color',
    description: 'Lighting sets mood and evokes emotion. I design lighting scenarios and color palettes that enhance storytelling and create atmosphere.',
  },
  {
    icon: Layers,
    title: 'Composition & Continuity',
    description: "Strong composition guides the viewer's eye. Character consistency and visual continuity ensure professional-quality output.",
  },
  {
    icon: Zap,
    title: 'Efficient Workflows',
    description: 'AI enables rapid iteration and exploration. I develop streamlined workflows that combine human creativity with AI efficiency.',
  },
  {
    icon: Volume2,
    title: 'Sound & Editing',
    description: 'Sound design and precise editing complete the cinematic experience. Every element works together to create impact.',
  },
];

export const Philosophy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stagger cards in from bottom on scroll
      gsap.from('.philosophy-card', {
        scrollTrigger: {
          trigger: '#philosophy',
          start: 'top 65%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
        opacity: 0,
        y: 50,
        stagger: {
          amount: 0.8,
          grid: [2, 3],
          from: 'start',
        },
      });

      // Rotate and scale icons
      gsap.from('.philosophy-icon', {
        scrollTrigger: {
          trigger: '#philosophy',
          start: 'top 60%',
          end: 'top 30%',
          scrub: 0.8,
        },
        scale: 0.5,
        opacity: 0,
        rotation: -30,
        stagger: 0.15,
      });

      // Section header fade in
      gsap.from('.philosophy .section-header', {
        scrollTrigger: {
          trigger: '#philosophy',
          start: 'top 70%',
          end: 'top 50%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 40,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" className="philosophy" ref={sectionRef}>
      <div className="philosophy-container">
        <div className="section-header">
          <h2 className="section-title">Filmmaking Philosophy</h2>
          <p className="section-subtitle">
            My approach to combining traditional filmmaking craft with AI-powered production.
          </p>
        </div>

        <div className="philosophy-grid">
          {PHILOSOPHY_ITEMS.map((item, index) => (
            <div key={index} className="philosophy-card">
              <div className="philosophy-icon">
                <item.icon size={32} />
              </div>
              <h3 className="philosophy-title">{item.title}</h3>
              <p className="philosophy-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};