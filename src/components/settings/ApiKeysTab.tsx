"use client";

import React from "react";
import { AppSettings } from "@/lib/settingsTypes";
import PrimaryProviderSelector from "./PrimaryProviderSelector";
import OpenAiKeySection from "./OpenAiKeySection";
import AnthropicKeySection from "./AnthropicKeySection";
import GeminiKeySection from "./GeminiKeySection";
import CustomLlmSection from "./CustomLlmSection";

interface ApiKeysTabProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  handlePasteClipboard: (keyName: keyof AppSettings) => void;
  testConnection: (provider: string) => void;
  testingConnection: string | null;
  connectionStatus: Record<string, { status: "success" | "error"; msg: string }>;
}

export default function ApiKeysTab({
  settings,
  updateSetting,
  handlePasteClipboard,
  testConnection,
  testingConnection,
  connectionStatus,
}: ApiKeysTabProps) {
  return (
    <div className="space-y-6">
      <PrimaryProviderSelector
        primaryProvider={settings.primaryProvider}
        onSelectProvider={(prov) => updateSetting("primaryProvider", prov)}
      />

      <OpenAiKeySection
        apiKey={settings.openaiApiKey}
        model={settings.openaiModel}
        onApiKeyChange={(val) => updateSetting("openaiApiKey", val)}
        onModelChange={(val) => updateSetting("openaiModel", val)}
        onPasteClipboard={() => handlePasteClipboard("openaiApiKey")}
        onTestConnection={() => testConnection("openai")}
        isTesting={testingConnection === "openai"}
        connectionStatus={connectionStatus["openai"]}
      />

      <AnthropicKeySection
        apiKey={settings.anthropicApiKey}
        model={settings.anthropicModel}
        onApiKeyChange={(val) => updateSetting("anthropicApiKey", val)}
        onModelChange={(val) => updateSetting("anthropicModel", val)}
        onPasteClipboard={() => handlePasteClipboard("anthropicApiKey")}
        onTestConnection={() => testConnection("anthropic")}
        isTesting={testingConnection === "anthropic"}
        connectionStatus={connectionStatus["anthropic"]}
      />

      <GeminiKeySection
        apiKey={settings.geminiApiKey}
        model={settings.geminiModel}
        onApiKeyChange={(val) => updateSetting("geminiApiKey", val)}
        onModelChange={(val) => updateSetting("geminiModel", val)}
        onPasteClipboard={() => handlePasteClipboard("geminiApiKey")}
        onTestConnection={() => testConnection("gemini")}
        isTesting={testingConnection === "gemini"}
        connectionStatus={connectionStatus["gemini"]}
      />

      <CustomLlmSection
        baseUrl={settings.customBaseUrl}
        apiKey={settings.customApiKey}
        model={settings.customModel}
        onBaseUrlChange={(val) => updateSetting("customBaseUrl", val)}
        onApiKeyChange={(val) => updateSetting("customApiKey", val)}
        onModelChange={(val) => updateSetting("customModel", val)}
      />
    </div>
  );
}
