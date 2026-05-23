// ============================================================
// PacketSense — Shared Type Definitions
// ============================================================

// --- Auth ---
export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// --- Quiz ---
export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  question_count?: number;
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  question: string;
  options: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizSubmission {
  category_id: string;
  answers: { question_id: string; selected: number }[];
}

export interface QuizResult {
  id: string;
  category_id: string;
  score: number;
  total_questions: number;
  answers: { question_id: string; selected: number; correct: number; is_correct: boolean }[];
  completed_at: string;
}

export interface QuizAttemptSummary {
  id: string;
  category_name: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

// --- Protocols ---
export type ProtocolSlug =
  | "tcp-handshake"
  | "tcp-retransmission"
  | "tcp-congestion"
  | "udp-communication"
  | "dns-lookup"
  | "arp-resolution"
  | "dhcp-assignment"
  | "http-vs-https";

export interface ProtocolInfo {
  slug: ProtocolSlug;
  name: string;
  description: string;
  category: string;
  steps: ProtocolStep[];
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

// --- Troubleshoot ---
export type IssueType =
  | "high-ping"
  | "packet-loss"
  | "websites-not-loading"
  | "dns-failure"
  | "slow-internet"
  | "gaming-lag"
  | "unstable-wifi";

export interface TroubleshootIssue {
  type: IssueType;
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
  related_protocols: ProtocolSlug[];
}

export interface TroubleshootSession {
  id: string;
  issue_type: IssueType;
  diagnosis: Diagnosis;
  created_at: string;
}

// --- Explain ---
export interface ExplainRequest {
  topic: string;
  context?: string;
}

export interface ExplainResponse {
  topic: string;
  explanation: string;
  analogy: string;
  key_points: string[];
  related_topics: string[];
}

// --- Dashboard ---
export interface DashboardStats {
  total_quizzes: number;
  average_score: number;
  protocols_viewed: number;
  troubleshoot_sessions: number;
  streak_days: number;
}

export interface ActivityItem {
  id: string;
  type: "quiz" | "protocol" | "troubleshoot";
  title: string;
  detail: string;
  timestamp: string;
}

// --- Progress ---
export interface UserProgress {
  feature: string;
  item_key: string;
  status: "not_started" | "in_progress" | "completed";
  metadata?: Record<string, unknown>;
  updated_at: string;
}
