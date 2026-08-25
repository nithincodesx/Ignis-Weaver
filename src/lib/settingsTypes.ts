// ── App Settings Types ──

export type PrimaryProvider = "openai" | "anthropic" | "gemini" | "custom";
export type VectorDbType = "pinecone" | "qdrant" | "weaviate" | "local";
export type LogVerbosity = "debug" | "info" | "warn" | "error";

export interface AppSettings {
  // API Keys
  openaiApiKey: string;
  openaiModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
  geminiApiKey: string;
  geminiModel: string;
  customBaseUrl: string;
  customApiKey: string;
  customModel: string;
  primaryProvider: PrimaryProvider;

  // Model & Execution Params
  temperature: number;
  maxTokens: number;
  enableAutoRouting: boolean;
  maxConcurrentTasks: number;
  taskTimeoutSeconds: number;
  autoRetryFailed: boolean;
  maxRetries: number;

  // Integrations
  githubToken: string;
  githubRepo: string;
  slackWebhookUrl: string;
  slackChannel: string;
  notionToken: string;
  notionDatabaseId: string;
  vectorDbType: VectorDbType;
  vectorDbEndpoint: string;
  vectorDbApiKey: string;

  // System & UI
  soundAlerts: boolean;
  refreshInterval: number; // in seconds
  privacyMode: boolean;
  logVerbosity: LogVerbosity;
  logRetentionDays: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  openaiApiKey: "",
  openaiModel: "gpt-4o",
  anthropicApiKey: "",
  anthropicModel: "claude-3-5-sonnet-20241022",
  geminiApiKey: "",
  geminiModel: "gemini-1.5-pro",
  customBaseUrl: "http://localhost:11434/v1",
  customApiKey: "",
  customModel: "llama3:latest",
  primaryProvider: "openai",

  temperature: 0.7,
  maxTokens: 4096,
  enableAutoRouting: true,
  maxConcurrentTasks: 4,
  taskTimeoutSeconds: 120,
  autoRetryFailed: true,
  maxRetries: 3,

  githubToken: "",
  githubRepo: "",
  slackWebhookUrl: "",
  slackChannel: "#guild-agent-alerts",
  notionToken: "",
  notionDatabaseId: "",
  vectorDbType: "local",
  vectorDbEndpoint: "http://localhost:6333",
  vectorDbApiKey: "",

  soundAlerts: true,
  refreshInterval: 5,
  privacyMode: false,
  logVerbosity: "info",
  logRetentionDays: 30,
};
