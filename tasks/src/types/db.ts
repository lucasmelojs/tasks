export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
  created_at: Date;
  updated_at: Date;
}
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date: Date;
  assigned_to: string;
  assigned_by: string;
  created_at: Date;
  updated_at: Date;
  assignee?: User; // Optional joined user data
  assignedBy?: User; // Optional joined user data
  comments_count?: number; // Optional count of comments
  attachments_count?: number; // Optional count of attachments
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: string;
  content: string;
  created_at: Date;
  user?: User; // Optional joined user data
}

export interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  created_at: Date;
}