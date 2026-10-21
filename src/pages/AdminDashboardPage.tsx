import { useState, useEffect, useCallback } from 'react';
import { Showreel } from '../components/Showreel';
import { ShowreelProject } from '../types/project';
import '../styles/globals.css';
import './AdminDashboardPage.css';

type ProjectCategory =
  | 'ai-films'
  | 'microdramas'
  | 'overview'
  | 'ads-brand-films'
  | 'filmmaking-breakdowns'
  | 'behind-the-scenes'
  | 'ai-experiments'
  | 'all';

interface AdminDashboardPageProps {
  onLogout: () => void;
}

// Demo projects for admin in mock mode
const DEMO_ADMIN_PROJECTS: ShowreelProject[] = [
  {
    id: 'demo-showreel',
    title: 'Showreel 2026',
    category: 'overview',
    description: 'Cinematic overview reel featuring best AI-generated work.',
    thumbnailPath: '/images/placeholder-showreel.jpg',
    videoPath: '/videos/Herbya_logo_animation_motion_gra_20261018182222.mp4',
    duration: '01:30',
    featured: true,
    published: true,
    slug: 'showreel-2026',
    year: 2026,
    role: 'Director',
    credits: 'Demo content',
    tools: ['AI Video Generation'],
    fullVideoUrl: '',
    previewVideoUrl: '/videos/Herbya_logo_animation_motion_gra_20261018182222.mp4',
    thumbnailUrl: '/images/placeholder-showreel.jpg',
    sortOrder: 0,
  },
];

export const AdminDashboardPage = ({ onLogout }: AdminDashboardPageProps) => {
  const [projects, setProjects] = useState<ShowreelProject[]>(DEMO_ADMIN_PROJECTS);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ShowreelProject | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ShowreelProject | null>(null);
  const [formData, setFormData] = useState<Partial<ShowreelProject>>({});

  useEffect(() => {
    document.title = 'Admin Dashboard - Himanshu Portfolio';
  }, []);

  // Load projects from mock data
  useEffect(() => {
    const loadProjects = async () => {
      if (isMockMode) {
        const { MOCK_PROJECTS } = await import('../lib/mockData');
        setProjects(MOCK_PROJECTS.map(p => ({
          ...p,
          id: p.id,
          slug: p.id,
          published: true,
          year: 2026,
          role: 'AI Filmmaker',
          credits: p.credits || '',
          tools: p.tools || [],
          fullVideoUrl: p.videoPath || '',
          previewVideoUrl: p.videoPath || '',
          thumbnailUrl: p.thumbnailPath,
          sortOrder: 0,
        })));
      }
    };
    loadProjects();
  }, []);

  const CATEGORIES: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ai-films', label: 'AI Films' },
    { key: 'microdramas', label: 'Microdramas' },
    { key: 'ads-brand-films', label: 'Ads & Brand Films' },
    { key: 'behind-the-scenes', label: 'BTS' },
    { key: 'ai-experiments', label: 'AI Experiments' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aOrder = a.sortOrder ?? 0;
    const bOrder = b.sortOrder ?? 0;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return aOrder - bOrder;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'ads-brand-films',
      description: '',
      year: new Date().getFullYear(),
      role: '',
      credits: '',
      thumbnailUrl: '',
      previewVideoUrl: '',
      fullVideoUrl: '',
      tools: [],
      featured: false,
      published: false,
      sortOrder: 0,
    });
  };

  const handleEdit = (project: ShowreelProject) => {
    setCurrentProject(project);
    setFormData({ ...project });
    setIsEditing(true);
  };

  const handleCreate = () => {
    resetForm();
    setCurrentProject(null);
    setIsEditing(true);
  };

  const handleDelete = (project: ShowreelProject) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
    }
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project: ShowreelProject = {
      id: currentProject?.id || crypto.randomUUID(),
      title: formData.title || '',
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || '',
      category: formData.category || 'ads-brand-films',
      description: formData.description || '',
      thumbnailPath: formData.thumbnailUrl || '',
      videoPath: formData.previewVideoUrl || '',
      duration: formData.duration || '',
      featured: formData.featured || false,
      published: formData.published || false,
      credits: formData.credits || '',
      tools: formData.tools || [],
      year: formData.year || new Date().getFullYear(),
      role: formData.role || '',
      thumbnailUrl: formData.thumbnailUrl || '',
      previewVideoUrl: formData.previewVideoUrl || '',
      fullVideoUrl: formData.fullVideoUrl || '',
      sortOrder: formData.sortOrder || 0,
    };

    if (currentProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([project, ...projects]);
    }

    setIsEditing(false);
    setCurrentProject(null);
    resetForm();
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePublished = (project: ShowreelProject) => {
    setProjects(projects.map(p =>
      p.id === project.id
        ? { ...p, published: !p.published, updated: new Date().toISOString() }
        : p
    ));
  };

  const toggleFeatured = (project: ShowreelProject) => {
    setProjects(projects.map(p =>
      p.id === project.id ? { ...p, featured: !p.featured } : p
    ));
  };

  const handleReorder = (projectId: string, direction: 'up' | 'down') => {
    const currentList = [...sortedProjects];
    const currentIndex = currentList.findIndex(p => p.id === projectId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentList.length) return;

    [currentList[currentIndex], currentList[newIndex]] = [currentList[newIndex], currentList[currentIndex]];

    const reordered = currentList.map((p, index) => ({ ...p, sortOrder: index }));
    setProjects(projects.map(p => {
      const updated = reordered.find(r => r.id === p.id);
      return updated || p;
    }));
  };

  const renderForm = () => (
    <div className="admin-modal-overlay" onClick={() => { setIsEditing(false); resetForm(); }}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{currentProject ? 'Edit Project' : 'Create New Project'}</h2>
          <button
            className="admin-modal-close"
            onClick={() => { setIsEditing(false); resetForm(); }}
          >
            ×
          </button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={e => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={e => handleInputChange('slug', e.target.value)}
                placeholder="url-friendly-slug"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category || 'ads-brand-films'}
                onChange={e => handleInputChange('category', e.target.value)}
              >
                {CATEGORIES.slice(1).map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={e => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={e => handleInputChange('role', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnailUrl || ''}
                onChange={e => handleInputChange('thumbnailUrl', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Preview Video URL</label>
              <input
                type="url"
                value={formData.previewVideoUrl || ''}
                onChange={e => handleInputChange('previewVideoUrl', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Full Film URL</label>
              <input
                type="url"
                value={formData.fullVideoUrl || ''}
                onChange={e => handleInputChange('fullVideoUrl', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="form-group full-width">
              <label>Credits</label>
              <textarea
                value={formData.credits || ''}
                onChange={e => handleInputChange('credits', e.target.value)}
                rows={2}
                placeholder="e.g. Director, Cinematographer, AI Generation, ..."
              />
            </div>
            <div className="form-group">
              <label>Tools (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tools) ? formData.tools.join(', ') : ''}
                onChange={e => handleInputChange('tools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder || 0}
                onChange={e => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={e => handleInputChange('featured', e.target.checked)}
                />
                Featured
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={e => handleInputChange('published', e.target.checked)}
                />
                Published
              </label>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setIsEditing(false); resetForm(); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentProject ? 'Update' : 'Create'} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <nav className="admin-breadcrumb">
            Dashboard &gt; Projects
          </nav>
        </div>
        <div className="admin-header-actions">
          <span className={`mode-badge ${isMockMode ? 'mock' : 'prod'}`}>
            {isMockMode ? 'MOCK MODE' : 'PRODUCTION'}
          </span>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Project
        </button>
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isMockMode && (
        <div className="admin-warning">
          ⚠️ Running in MOCK MODE. Changes are local only and will not persist across refreshes or be visible on the live site. Configure Supabase to enable persistent storage.
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project, index) => (
              <tr key={project.id}>
                <td>
                  <div className="reorder-controls">
                    <button
                      className="reorder-btn"
                      onClick={() => handleReorder(project.id, 'up')}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <span>{index + 1}</span>
                    <button
                      className="reorder-btn"
                      onClick={() => handleReorder(project.id, 'down')}
                      disabled={index === sortedProjects.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <div className="admin-thumbnail">
                    <img
                      src={project.thumbnailUrl || '/images/placeholder-showreel.jpg'}
                      alt={project.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-showreel.jpg';
                      }}
                    />
                  </div>
                </td>
                <td className="admin-title">{project.title}</td>
                <td>{project.category}</td>
                <td>{project.year}</td>
                <td>
                  <button
                    className={`toggle-btn ${project.featured ? 'active' : ''}`}
                    onClick={() => toggleFeatured(project)}
                    aria-label={project.featured ? 'Unfeature' : 'Feature'}
                    title={project.featured ? 'Unfeature' : 'Feature'}
                  >
                    {project.featured ? '★ Featured' : '○ Feature'}
                  </button>
                </td>
                <td>
                  <button
                    className={`toggle-btn ${project.published ? 'active' : ''}`}
                    onClick={() => togglePublished(project)}
                    aria-label={project.published ? 'Unpublish' : 'Publish'}
                    title={project.published ? 'Unpublish' : 'Publish'}
                  >
                    {project.published ? '● Published' : '○ Draft'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(project)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(project)}
                      aria-label="Delete"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedProjects.length === 0 && (
          <div className="admin-empty">
            No projects found in this category.
          </div>
        )}
      </div>

      {isEditing && renderForm()}

      {showDeleteConfirm && projectToDelete && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete "{projectToDelete.title}"? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

