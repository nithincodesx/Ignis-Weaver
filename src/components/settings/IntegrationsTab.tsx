"use client";

import React from "react";
import { AppSettings } from "@/lib/settingsTypes";
import GithubIntegrationSection from "./GithubIntegrationSection";
import SlackAlertsSection from "./SlackAlertsSection";
import VectorDbSection from "./VectorDbSection";

interface IntegrationsTabProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  testConnection: (provider: string) => void;
  testingConnection: string | null;
}

export default function IntegrationsTab({
  settings,
  updateSetting,
  testConnection,
  testingConnection,
}: IntegrationsTabProps) {
  return (
    <div className="space-y-6">
      <GithubIntegrationSection
        token={settings.githubToken}
        repo={settings.githubRepo}
        onTokenChange={(val) => updateSetting("githubToken", val)}
        onRepoChange={(val) => updateSetting("githubRepo", val)}
        onVerify={() => testConnection("github")}
        isTesting={testingConnection === "github"}
      />

      <SlackAlertsSection
        webhookUrl={settings.slackWebhookUrl}
        channel={settings.slackChannel}
        onWebhookChange={(val) => updateSetting("slackWebhookUrl", val)}
        onChannelChange={(val) => updateSetting("slackChannel", val)}
        onTestWebhook={() => testConnection("slack")}
        isTesting={testingConnection === "slack"}
      />

      <VectorDbSection
        dbType={settings.vectorDbType}
        endpoint={settings.vectorDbEndpoint}
        apiKey={settings.vectorDbApiKey}
        onTypeChange={(val) => updateSetting("vectorDbType", val)}
        onEndpointChange={(val) => updateSetting("vectorDbEndpoint", val)}
        onApiKeyChange={(val) => updateSetting("vectorDbApiKey", val)}
      />
    </div>
  );
}
