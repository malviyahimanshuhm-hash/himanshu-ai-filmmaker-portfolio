import { Project, Category, CATEGORIES } from '../types/project';
import { MOCK_PROJECTS } from '../lib/mockData';

export { CATEGORIES };
export type { Category, Project };

export const PROJECTS: Project[] = MOCK_PROJECTS;

export const getCategoryProjects = (category: Category): Project[] => {
  return PROJECTS.filter(p => p.category === category);
};
