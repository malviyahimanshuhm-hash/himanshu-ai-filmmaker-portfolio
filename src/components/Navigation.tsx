import { useEffect, useState } from 'react';
import { Menu, X, Film } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Determine active section for scroll-spy
      const sections = ['hero', 'showreel', 'work', 'about', 'process', 'journey', 'philosophy', 'contact'];
      for (const sectionId of sections.reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link 
          to="/" 
          className="nav-brand" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Himanshu AI Filmmaker Home"
        >
          <div className="brand-logo-mark">
            <Film size={18} />
          </div>
          <span className="brand-name">HIMANSHU</span>
          <span className="brand-badge">DIRECTOR</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav aria-label="Main Navigation">
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <a 
                href="#showreel" 
                className={activeSection === 'showreel' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('showreel'); }}
              >
                Showreel
              </a>
            </li>
            <li>
              <a 
                href="#work" 
                className={activeSection === 'work' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('work'); }}
              >
                Work
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#process" 
                className={activeSection === 'process' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('process'); }}
              >
                Process
              </a>
            </li>
            <li>
              <a 
                href="#journey" 
                className={activeSection === 'journey' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('journey'); }}
              >
                Journey
              </a>
            </li>
            <li>
              <a 
                href="#philosophy" 
                className={activeSection === 'philosophy' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo('philosophy'); }}
              >
                Philosophy
              </a>
            </li>
            <li className="nav-contact-li">
              <a 
                href="#contact" 
                className="nav-contact-btn"
                onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
              >
                Let's Talk
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
