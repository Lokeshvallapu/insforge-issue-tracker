export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  profile?: {
    name?: string;
    avatar_url?: string;
  };
}