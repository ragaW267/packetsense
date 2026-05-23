// ============================================================
// PacketSense Frontend — Shared Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  question_count: number;
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  question: string;
  options: string[];
  difficulty: string;
}

export interface QuizResultDetail {
  question_id: string;
  question: string;
  options: string[];
  selected: number;
  correct: number;
  is_correct: boolean;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  category_id: string;
  category_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  details: QuizResultDetail[];
  completed_at: string;
}

export interface QuizAttemptSummary {
  id: string;
  category_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export interface QuizStats {
  total_attempts: number;
  average_score: number;
  best_category?: string;
  categories_attempted: number;
  recent_attempts: QuizAttemptSummary[];
}

export interface ProtocolInfo {
  slug: string;
  name: string;
  description: string;
  category: string;
  step_count?: number;
  overview?: string;
  steps?: ProtocolStep[];
  key_concepts?: string[];
}

export interface ProtocolStep {
  id: number;
  label: string;
  description: string;
  from: string;
  to: string;
  packet_label?: string;
  color?: string;
}

export interface TroubleshootIssue {
  type: string;
  label: string;
  description: string;
  icon: string;
}

export interface TroubleshootQuestion {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

export interface TroubleshootAnswer {
  question_id: string;
  value: string;
}

export interface Diagnosis {
  cause: string;
  title: string;
  description: string;
  confidence: number;
  solutions: string[];
  related_protocols: string[];
}

export interface TroubleshootResult {
  id: string;
  issue_type: string;
  diagnosis: Diagnosis;
  created_at: string;
}

export interface TroubleshootHistoryItem {
  id: string;
  issue_type: string;
  diagnosis_title: string;
  created_at: string;
}

export interface ExplainResponse {
  topic: string;
  explanation: string;
  analogy: string;
  key_points: string[];
  related_topics: string[];
}

export interface DashboardStats {
  total_quizzes: number;
  average_score: number;
  protocols_viewed: number;
  troubleshoot_sessions: number;
  streak_days: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  timestamp: string;
}
