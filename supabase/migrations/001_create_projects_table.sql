-- Supabase SQL Migration: Portfolio Projects Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'ai-films',
    'microdramas',
    'overview',
    'ads-brand-films',
    'filmmaking-breakdowns',
    'behind-the-scenes',
    'ai-experiments'
  )),
  description TEXT,
  year INTEGER,
  role TEXT,
  credits TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  full_video_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  tools TEXT[], -- Array of tool names
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on published projects
CREATE INDEX idx_projects_published ON public.projects(published);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_projects_sort_order ON public.projects(sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to projects table
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Public can read published projects"
ON public.projects
FOR SELECT
USING (published = true);

-- Authenticated users can read all projects (for admin dashboard)
CREATE POLICY "Authenticated users can read all projects"
ON public.projects
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (true);

-- Insert demo projects for testing (optional)
INSERT INTO public.projects (title, slug, category, description, year, role, thumbnail_url, preview_video_url, featured, published, tools)
VALUES
  (
    'Herbvia Brand Content - Product Showcase',
    'herbvia-product-showcase',
    'ads-brand-films',
    'AI-generated brand content showcasing moringa health product with cinematic composition and lighting.',
    2026,
    'AI Filmmaker & Director',
    '/images/thumb-herbvia-picking.jpg',
    '/videos/Woman_picking_and_presenting_orange_20261018083200.mp4',
    true,
    true,
    ARRAY['AI Video Generation', 'Lighting Design', 'Composition']
  ),
  (
    'Herbvia Logo Animation',
    'herbvia-logo-animation',
    'ads-brand-films',
    'Brand logo reveal animation with motion graphics elements.',
    2026,
    'Motion Designer',
    '/images/thumb-logo-animation.jpg',
    '/videos/Herbya_logo_animation_motion_gra_20261018182222.mp4',
    true,
    true,
    ARRAY['Motion Graphics', 'Logo Animation', 'Sound Design']
  )
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE public.projects IS 'Portfolio projects for Himanshu AI Filmmaker website';
COMMENT ON COLUMN public.projects.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.projects.category IS 'Project category matching frontend filters';
COMMENT ON COLUMN public.projects.featured IS 'Featured projects appear first in portfolio';
COMMENT ON COLUMN public.projects.published IS 'Only published projects are visible to public';
COMMENT ON COLUMN public.projects.sort_order IS 'Manual sort order (lower numbers appear first)';
