// ── Agent Status ──
export type AgentStatus = "active" | "idle" | "warning" | "error" | "completed";

// ── Agent Roles ──
export type AgentRole =
  | "orchestrator"
  | "researcher"
  | "developer"
  | "analyst"
  | "designer"
  | "qa-engineer";

// ── Agent Node ──
export interface AgentNode {
  id: string;
  role: AgentRole;
  name: string;
  subtitle: string;
  status: AgentStatus;
  efficiency: number;
  tasksCompleted: number;
  tasksTotal: number;
  lastActive: string;
  avatar: string;
  accentColor: string;
  description: string;
}

// ── Team Tag ──
export interface TeamTag {
  id: string;
  color: string;
  icon: string;
}

// ── Connection Item ──
export interface ConnectionItem {
  id: string;
  type: "mail" | "meet" | "notion" | "slack" | "github";
  label: string;
}

// ── Navigation ──
export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

// ── Metrics ──
export interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
}

// ── Workflow ──
export type WorkflowStepStatus = "completed" | "active" | "pending" | "failed";

export interface WorkflowStep {
  id: string;
  label: string;
  agent: AgentRole;
  status: WorkflowStepStatus;
  duration?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  progress: number;
}

// ── Activity Feed ──
export type ActivityType = "task_complete" | "agent_started" | "alert" | "insight" | "deploy" | "sync";

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  agent: AgentRole;
  agentName: string;
  message: string;
  timestamp: Date;
  metadata?: string;
}

// ── Chat ──
export type AgentPersonality = "analytical" | "strategic" | "creative" | "technical" | "financial" | "operational";

export interface ChatMessage {
  id: string;
  agentId: AgentRole;
  agentName: string;
  personality: AgentPersonality;
  content: string;
  timestamp: Date;
  type: "message" | "system" | "alert" | "insight";
  thinking?: boolean;
}

// ── Role Configuration ──
export const ROLE_CONFIG: Record<
  AgentRole,
  {
    name: string;
    subtitle: string;
    avatar: string;
    icon: string;
    accentColor: string;
    teams: TeamTag[];
    connections: ConnectionItem[];
    description: string;
  }
> = {
  orchestrator: {
    name: "PAUL",
    subtitle: "ORCHESTRATOR",
    avatar: "/avatars/paul.png",
    icon: "Cpu",
    accentColor: "from-emerald-400 to-teal-500",
    description: "Coordinates tasks across all agents and routes requests to the right specialist.",
    teams: [
      { id: "t1", color: "purple", icon: "✦" },
      { id: "t2", color: "pink", icon: "✿" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "meet", label: "Meet" },
      { id: "c3", type: "notion", label: "Notion" },
    ],
  },
  researcher: {
    name: "MARCO",
    subtitle: "USER RESEARCHER",
    avatar: "/avatars/marco.png",
    icon: "Search",
    accentColor: "from-blue-400 to-indigo-500",
    description: "Runs research sessions, conducts interviews, and obtains real insights.",
    teams: [
      { id: "t2", color: "pink", icon: "✿" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "meet", label: "Meet" },
      { id: "c3", type: "notion", label: "Notion" },
    ],
  },
  developer: {
    name: "VIKTOR",
    subtitle: "BACKEND ENGINEER",
    avatar: "/avatars/viktor.png",
    icon: "Code2",
    accentColor: "from-violet-400 to-purple-500",
    description: "Optimizes cluster pipelines, memory utilization, and network sync models.",
    teams: [
      { id: "t1", color: "purple", icon: "✦" },
      { id: "t2", color: "pink", icon: "✿" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "slack", label: "Slack" },
      { id: "c3", type: "github", label: "GitHub" },
    ],
  },
  analyst: {
    name: "ALEXIS",
    subtitle: "PRODUCT ANALYST",
    avatar: "/avatars/alexis.png",
    icon: "BarChart3",
    accentColor: "from-amber-400 to-orange-500",
    description: "Translates findings into actionable product requirements and roadmaps.",
    teams: [
      { id: "t2", color: "pink", icon: "✿" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "meet", label: "Meet" },
      { id: "c3", type: "notion", label: "Notion" },
    ],
  },
  designer: {
    name: "SARAH",
    subtitle: "UX DESIGNER",
    avatar: "/avatars/sarah.png",
    icon: "Palette",
    accentColor: "from-pink-400 to-rose-500",
    description: "Builds high-performance user interfaces with brutalist pixel perfection.",
    teams: [
      { id: "t1", color: "purple", icon: "✦" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "slack", label: "Slack" },
      { id: "c3", type: "notion", label: "Notion" },
    ],
  },
  "qa-engineer": {
    name: "ELENA",
    subtitle: "QA AUDITOR",
    avatar: "/avatars/elena.png",
    icon: "ShieldCheck",
    accentColor: "from-cyan-400 to-sky-500",
    description: "Performs integration assertions, validates schemas, and checks accessibility.",
    teams: [
      { id: "t2", color: "pink", icon: "✿" },
    ],
    connections: [
      { id: "c1", type: "mail", label: "Gmail" },
      { id: "c2", type: "meet", label: "Meet" },
      { id: "c3", type: "notion", label: "Notion" },
    ],
  },
};

export const AGENT_ROLES: AgentRole[] = [
  "orchestrator",
  "researcher",
  "developer",
  "analyst",
  "designer",
  "qa-engineer",
];

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "manage", label: "Agents", icon: "Users" },
  { id: "workflows", label: "Workflows", icon: "GitBranch" },
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "settings", label: "Settings", icon: "Settings" },
];
