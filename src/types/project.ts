export interface Project {
  id: string;
  title: string;
  slug?: string;
  category: Category;
  categoryLabel?: string;
  description: string;
  thumbnailPath: string;
  videoPath?: string;
  duration?: string;
  featured?: boolean;
  published?: boolean;
  credits?: string;
  tools?: string[];
  year?: number;
  role?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  fullVideoUrl?: string;
  sortOrder?: number;
}

export interface ShowreelProject extends Project {
  slug: string;
  year: number;
  role: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  fullVideoUrl: string;
  sortOrder: number;
  published: boolean;
  updated?: string;
}

export type Category = 
  | 'ai-films'
  | 'microdramas'
  | 'overview'
  | 'ads-brand-films'
  | 'filmmaking-breakdowns'
  | 'behind-the-scenes'
  | 'ai-experiments';

export const CATEGORIES = {
  'ai-films': { label: 'AI Films', icon: 'film' },
  'microdramas': { label: 'Microdramas', icon: 'video' },
  'ads-brand-films': { label: 'Ads & Brand Films', icon: 'briefcase' },
  'filmmaking-breakdowns': { label: 'Breakdowns', icon: 'settings' },
  'behind-the-scenes': { label: 'Behind the Scenes', icon: 'camera' },
  'ai-experiments': { label: 'Experiments', icon: 'zap' },
} as const;
