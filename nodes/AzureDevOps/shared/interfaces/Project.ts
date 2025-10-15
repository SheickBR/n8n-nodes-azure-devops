export interface Project {
  id: string;
  name: string;
  description?: string;
  state?: 'wellFormed' | 'createPending' | 'deleting' | 'new';
  revision?: number;
  visibility?: 'private' | 'public';
  [key: string]: any;
}
