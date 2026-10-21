import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Project } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';
import { Navigation } from '../components/Navigation';
import './ProjectDetailPage.css';

export const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Load project by slug from mock data
    const found = MOCK_PROJECTS.find(p => p.id === slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
    if (found) {
      setProject({
        ...found,
        slug: slug || found.id,
      });
    } else {
      // Project not found, redirect to home
      navigate('/');
    }
  }, [slug, navigate]);

  if (!project) {
    return <div className="project-loading">Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <div className="project-detail-page">
        <div className="project-detail-container">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Portfolio
          </button>

          <div className="project-detail-header">
            <h1>{project.title}</h1>
            <div className="project-meta">
              <span className="project-category">{project.categoryLabel || project.category}</span>
              {project.year && <span className="project-year">{project.year}</span>}
              {project.duration && <span className="project-duration">{project.duration}</span>}
            </div>
          </div>

          <div className="project-video-player">
            {project.videoPath && (
              <video
                src={project.videoPath}
                controls
                poster={project.thumbnailPath}
                preload="metadata"
                aria-label={`${project.title} video`}
              />
            )}
          </div>

          <div className="project-detail-content">
            <div className="project-description">
              <h2>About This Project</h2>
              <p>{project.description}</p>
            </div>

            {project.credits && (
              <div className="project-credits">
                <h3>Credits</h3>
                <p>{project.credits}</p>
              </div>
            )}

            {project.tools && project.tools.length > 0 && (
              <div className="project-tools">
                <h3>Tools & Techniques</h3>
                <div className="tool-tags">
                  {project.tools.map((tool, index) => (
                    <span key={index} className="tool-tag">{tool}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
