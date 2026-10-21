import { useState } from 'react';
import { Mail, Instagram, Youtube, Linkedin, Send, CheckCircle2, ArrowUp, MapPin, Sparkles } from 'lucide-react';
import { CONTACT_CONFIG } from '../config/contact';
import './Contact.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Commercial / Brand Film',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const emailAddress = CONTACT_CONFIG.EMAIL_ADDRESS || 'himanshumalviya.ai@gmail.com';
  const instagramUrl = CONTACT_CONFIG.INSTAGRAM_URL || 'https://instagram.com';
  const youtubeUrl = CONTACT_CONFIG.YOUTUBE_URL || 'https://youtube.com';
  const linkedinUrl = CONTACT_CONFIG.LINKEDIN_URL || 'https://linkedin.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Trigger mailto intent with prefilled details
    const subject = encodeURIComponent(`[Project Inquiry] ${formData.projectType} — ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\nProject Brief:\n${formData.message}`
    );
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');

    setSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="contact" aria-label="Contact and Collaboration">
      <div className="contact-container">
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={15} />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="section-title">Let's Collaborate</h2>
          <p className="section-subtitle">
            Have a commercial campaign, narrative concept, or microdrama series in mind? Let's build something cinematic together.
          </p>
        </div>

        <div className="contact-content-grid">
          {/* Left Column: Direct Inquiries & Contact Cards */}
          <div className="contact-info-panel">
            <h3 className="panel-title">Direct Inquiries</h3>
            <p className="panel-desc">
              Open for commercial directorship, AI film commissions, virtual production consulting, and creative collaborations worldwide.
            </p>

            <div className="contact-channels">
              <a href={`mailto:${emailAddress}`} className="contact-card" aria-label="Send Email">
                <div className="channel-icon">
                  <Mail size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Email Directly</span>
                  <span className="channel-value">{emailAddress}</span>
                </div>
              </a>

              <div className="contact-card location-card">
                <div className="channel-icon">
                  <MapPin size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Base Location</span>
                  <span className="channel-value">Mumbai, India • Available Globally</span>
                </div>
              </div>
            </div>

            <div className="social-links-block">
              <span className="social-title">Connect & Follow</span>
              <div className="social-buttons-row">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Instagram Profile"
                >
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="YouTube Channel"
                >
                  <Youtube size={18} />
                  <span>YouTube</span>
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="contact-form-panel">
            {submitted ? (
              <div className="form-success-card" role="alert">
                <CheckCircle2 size={48} className="success-icon" />
                <h3>Inquiry Initiated!</h3>
                <p>
                  Thank you for reaching out, <strong>{formData.name}</strong>. Your project brief has been formatted.
                  If your email client didn't open automatically, write to <strong>{emailAddress}</strong>.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form className="inquiry-form" onSubmit={handleSubmit}>
                <h3 className="panel-title">Project Inquiry Form</h3>

                <div className="form-group">
                  <label htmlFor="contact-name">Your Name / Organization *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma / Studio"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="aditi@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-project-type">Project Scope</label>
                  <select
                    id="contact-project-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="Commercial / Brand Film">Commercial / Brand Film</option>
                    <option value="AI Narrative Film / Short">AI Narrative Film / Short</option>
                    <option value="Vertical Microdrama Series">Vertical Microdrama Series</option>
                    <option value="Motion Identity & VFX">Motion Identity & VFX</option>
                    <option value="Consulting & Masterclass">Consulting & Masterclass</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Project Vision & Timeline</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Briefly describe your creative vision, references, or timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  <Send size={18} />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Cinematic Footer */}
        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-title">HIMANSHU MALVIYA</span>
              <span className="footer-tagline">Building the Future of Indian Cinema with AI</span>
            </div>
            <button
              className="back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Himanshu Malviya. All rights reserved.</p>
            <p className="footer-note">Crafted with React, Three.js & Generative AI</p>
          </div>
        </footer>
      </div>
    </section>
  );
};
