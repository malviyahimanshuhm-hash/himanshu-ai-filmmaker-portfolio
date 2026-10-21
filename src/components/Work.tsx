import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Sparkles, Clock, Tag } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES, Category, Project } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';
import './Work.css';

gsap.registerPlugin(ScrollTrigger);

interface WorkProps {
  onProjectSelect?: (project: Project) => void;
}

export const Work = ({ onProjectSelect }: WorkProps) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const activeVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isVortexCompleteRef = useRef(false);

  // Filter projects by category, excluding the master showreel from the gallery grid
  const galleryProjects = projects.filter(p => p.id !== 'master-showreel-2026');
  const filteredProjects = activeCategory === 'all'
    ? galleryProjects
    : galleryProjects.filter(p => p.category === activeCategory);

  // --- Phase 3: The Portfolio Vortex Transition ---
  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = gridRef.current.querySelectorAll<HTMLElement>('.project-card');
    if (cards.length === 0) return;

    if (prefersReducedMotion) {
      // Accessible reduced motion: simple static display
      gsap.set(cards, { opacity: 1, x: 0, y: 0, rotationZ: 0, rotationX: 0, scale: 1 });
      return;
    }

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Master ScrollTrigger timeline for the vortex sequence
      const vortexTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1.2,
          onUpdate: (self) => {
            isVortexCompleteRef.current = self.progress >= 0.98;
          },
        },
      });

      // 1. Reveal "MY PORTFOLIO / SELECTED WORK" heading
      vortexTimeline.fromTo(
        '.work .section-header',
        { opacity: 0, y: 50, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' },
        0
      );

      // 2. Filter buttons fade in
      vortexTimeline.fromTo(
        '.work .category-filter',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        0.15
      );

      // 3. 3D Orbital Guide Ring
      vortexTimeline.fromTo(
        '.vortex-orbital-ring',
        { opacity: 0, scale: 0.8, rotationX: 75 },
        { opacity: 0.7, scale: 1, rotationX: 75, duration: 0.35, ease: 'power2.out' },
        0.1
      );
      vortexTimeline.to(
        '.vortex-orbital-ring',
        { opacity: 0, scale: 1.15, duration: 0.45, ease: 'power2.in' },
        0.65
      );

      if (isMobile) {
        // Mobile-optimized lightweight stagger
        cards.forEach((card, i) => {
          vortexTimeline.fromTo(
            card,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            0.2 + i * 0.08
          );
        });
      } else {
        // Desktop / Tablet: Complete 3D Circular Orbit Ring Structure
        const gridW = gridRef.current?.offsetWidth || 1200;
        const centerX = gridW / 2;
        const centerY = 300;
        const radius = Math.min(gridW * 0.36, 420);

        cards.forEach((card, index) => {
          // Compute delta between card's natural grid center and common orbital center
          const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
          const cardCenterY = card.offsetTop + card.offsetHeight / 2;
          const toCenterX = centerX - cardCenterX;
          const toCenterY = centerY - cardCenterY;

          // Circular orbit coordinates (cards evenly distributed around full 360° circle)
          const angle = (index / cards.length) * Math.PI * 2;
          const orbitX = Math.sin(angle) * radius;
          const orbitZ = (Math.cos(angle) - 1) * (radius * 0.75); // Negative Z for depth
          const orbitY = Math.sin(angle * 2) * 28; // Subtle orbital wave
          const orbitRotY = Math.round((angle * 180) / Math.PI); // Facing circle tangent
          const orbitRotX = 8;
          const depthNorm = (Math.cos(angle) + 1) / 2; // 0 for back cards, 1 for front cards
          const orbitScale = 0.65 + depthNorm * 0.32;
          const orbitOpacity = 0.52 + depthNorm * 0.48;

          vortexTimeline.fromTo(
            card,
            {
              x: toCenterX + orbitX,
              y: toCenterY + orbitY,
              z: orbitZ,
              rotationY: orbitRotY,
              rotationX: orbitRotX,
              scale: orbitScale,
              opacity: orbitOpacity,
            },
            {
              x: 0,
              y: 0,
              z: 0,
              rotationY: 0,
              rotationX: 0,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            },
            0.2 + (index * 0.09) // Staggered arrival sequence into final grid slots
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [galleryProjects.length]);

  // Clean animation when user changes category filters
  const handleCategoryChange = useCallback((cat: Category | 'all') => {
    setActiveCategory(cat);
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>('.project-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
        );
      }
    });
  }, []);

  const handleMouseEnter = (id: string) => {
    const video = activeVideoRefs.current.get(id);
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    const video = activeVideoRefs.current.get(id);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, project: Project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onProjectSelect?.(project);
    }
  };

  return (
    <section id="work" className="work" ref={sectionRef} aria-label="Selected Projects Portfolio">
      <div className="work-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={15} />
            <span>MY PORTFOLIO</span>
          </div>
          <h2 className="section-title">Selected Work</h2>
          <p className="section-subtitle">
            Curated cinematic AI productions spanning narrative films, commercial spots, microdramas, and workflow breakdowns.
          </p>
        </div>

        {/* Category Filters */}
        <div className="category-filter" role="tablist" aria-label="Filter projects by category">
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All Works ({galleryProjects.length})
          </button>
          {Object.entries(CATEGORIES).map(([key, value]) => {
            const count = galleryProjects.filter(p => p.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={activeCategory === key}
                className={`filter-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(key as Category)}
              >
                {value.label} ({count})
              </button>
            );
          })}
        </div>

        {/* 3D Circular Orbit Ring Guide */}
        <div className="vortex-orbital-ring" aria-hidden="true" />

        {/* Projects Grid Container (Vortex & Grid target) */}
        <div className="projects-grid" ref={gridRef}>
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              tabIndex={0}
              role="button"
              aria-label={`Open project details for ${project.title}`}
              onClick={() => onProjectSelect?.(project)}
              onKeyDown={(e) => handleCardKeyDown(e, project)}
              onMouseEnter={() => handleMouseEnter(project.id)}
              onMouseLeave={() => handleMouseLeave(project.id)}
              onFocus={() => handleMouseEnter(project.id)}
              onBlur={() => handleMouseLeave(project.id)}
            >
              <div className="project-thumbnail">
                {project.videoPath ? (
                  <video
                    ref={(el) => {
                      if (el) activeVideoRefs.current.set(project.id, el);
                      else activeVideoRefs.current.delete(project.id);
                    }}
                    src={project.videoPath}
                    poster={project.thumbnailPath}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="card-video"
                  />
                ) : (
                  <img
                    src={project.thumbnailPath}
                    alt={project.title}
                    loading="lazy"
                    className="card-image"
                  />
                )}

                {/* Duration Badge */}
                {project.duration && (
                  <span className="card-duration-badge">
                    <Clock size={12} />
                    {project.duration}
                  </span>
                )}

                {/* Hover Play Icon Overlay */}
                <div className="play-overlay" aria-hidden="true">
                  <div className="play-icon">
                    <Play size={22} fill="#0a0a0c" />
                  </div>
                  <span className="play-prompt">Click to Watch Full Film</span>
                </div>
              </div>

              <div className="project-info">
                <div className="project-category-row">
                  <span className="project-category-tag">
                    <Tag size={11} />
                    {project.categoryLabel || project.category}
                  </span>
                  {project.year && <span className="project-year">{project.year}</span>}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {project.tools && project.tools.length > 0 && (
                  <div className="project-tools">
                    {project.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="tool-tag">{tool}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="no-projects-message">
            <p>No projects found in this category yet. New releases arriving soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};
