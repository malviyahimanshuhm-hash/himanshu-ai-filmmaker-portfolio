import { useEffect, useState, useCallback } from 'react';
import { Hero } from '../components/Hero';
import { Showreel } from '../components/Showreel';
import { Work } from '../components/Work';
import { VideoModal } from '../components/VideoModal';
import { About } from '../components/About';
import { Process } from '../components/Process';
import { Journey } from '../components/Journey';
import { Philosophy } from '../components/Philosophy';
import { Contact } from '../components/Contact';
import { Navigation } from '../components/Navigation';
import { AudioControls } from '../components/AudioControls';
import { Project } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';
import { isMockMode } from '../lib/supabase';
import '../styles/globals.css';

export function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isMockMode) {
      console.info('[Portfolio] Himanshu AI Filmmaker running in verified local mode.');
    }
  }, []);

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedProject(null);
  }, []);

  const handleWatchShowreel = useCallback(() => {
    const reel = MOCK_PROJECTS.find(p => p.id === 'master-showreel-2026') || MOCK_PROJECTS[0];
    setSelectedProject(reel);
    setShowModal(true);
  }, []);

  return (
    <>
      <Navigation />
      <AudioControls />
      <main id="main-content">
        <Hero onWatchShowreel={handleWatchShowreel} />
        <Showreel onProjectSelect={handleProjectSelect} />
        <Work onProjectSelect={handleProjectSelect} />
        <About />
        <Process />
        <Journey />
        <Philosophy />
        <Contact />
      </main>
      <VideoModal
        project={selectedProject}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
