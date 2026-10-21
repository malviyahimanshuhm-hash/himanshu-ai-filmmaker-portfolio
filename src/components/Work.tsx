import { useState, useRef } from 'react';
import { Play, Sparkles, Clock, Tag } from 'lucide-react';
import { CATEGORIES, Category, Project } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';
import './Work.css';

interface WorkProps {
  onProjectSelect?: (project: Project) => void;
}

export const Work = ({ onProjectSelect }: WorkProps) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const activeVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Filter projects by category, excluding the master showreel from the gallery grid
  const galleryProjects = projects.filter(p => p.id !== 'master-showreel-2026');
  const filteredProjects = activeCategory === 'all'
    ? galleryProjects
    : galleryProjects.filter(p => p.category === activeCategory);

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
    <section id="work" className="work" aria-label="Selected Projects">
      <div className="work-container">
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={15} />
            <span>PORTFOLIO</span>
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
            onClick={() => setActiveCategory('all')}
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
                onClick={() => setActiveCategory(key as Category)}
              >
                {value.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
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
