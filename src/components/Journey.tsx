import { MapPin } from 'lucide-react';
import './Journey.css';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineItem[] = [
  {
    year: '2024',
    title: 'Discovery & Learning',
    description: 'Began exploring AI generation tools and their application to filmmaking. Studied camera language, lighting, and composition fundamentals.',
  },
  {
    year: '2025',
    title: 'First AI Films',
    description: 'Created initial AI-generated video experiments. Developed understanding of prompt engineering and AI video generation workflows.',
  },
  {
    year: '2026',
    title: 'Brand Projects',
    description: 'Produced commercial content for brands using AI filmmaking techniques. Built production workflows combining traditional and AI methods.',
  },
  {
    year: 'Present',
    title: 'Building the Future',
    description: 'Continuing to push boundaries of AI cinema. Focusing on storytelling, character consistency, and production quality.',
  },
];

export const Journey = () => {
  return (
    <section id="journey" className="journey">
      <div className="journey-container">
        <div className="section-header">
          <h2 className="section-title">My Journey</h2>
          <p className="section-subtitle">
            The evolution from discovering AI tools to crafting cinematic narratives.
          </p>
        </div>

        <div className="timeline">
          {TIMELINE.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                {index < TIMELINE.length - 1 && <div className="marker-line"></div>}
              </div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};