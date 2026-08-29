"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { AppSettings, DEFAULT_SETTINGS } from "@/lib/settingsTypes";
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  resetSettingsStorage,
} from "@/lib/settingsStorage";
import SettingsHeader from "./settings/SettingsHeader";
import SettingsTabNav, { SettingsTabId } from "./settings/SettingsTabNav";
import ApiKeysTab from "./settings/ApiKeysTab";
import AgentExecutionTab from "./settings/AgentExecutionTab";
import IntegrationsTab from "./settings/IntegrationsTab";
import SystemPreferencesTab from "./settings/SystemPreferencesTab";
import HealthDiagnosticsTab from "./settings/HealthDiagnosticsTab";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<SettingsTabId>("api");

  // UI status feedback
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, { status: "success" | "error"; msg: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Load stored settings on client mount
  useEffect(() => {
    setSettings(loadSettingsFromStorage());
  }, []);

  const handleSave = () => {
    const success = saveSettingsToStorage(settings);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(DEFAULT_SETTINGS);
      resetSettingsStorage();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasteClipboard = async (keyName: keyof AppSettings) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        updateSetting(keyName, text as any);
      }
    } catch (err) {
      alert("Unable to access clipboard. Please paste manually using Ctrl+V or Cmd+V.");
    }
  };

  const testConnection = async (provider: string) => {
    setTestingConnection(provider);

    let keyOrToken = "";
    let baseUrl = "";
    if (provider === "openai") keyOrToken = settings.openaiApiKey;
    else if (provider === "anthropic") keyOrToken = settings.anthropicApiKey;
    else if (provider === "gemini") keyOrToken = settings.geminiApiKey;
    else if (provider === "custom") {
      keyOrToken = settings.customApiKey;
      baseUrl = settings.customBaseUrl;
    } else if (provider === "github") keyOrToken = settings.githubToken;
    else if (provider === "slack") keyOrToken = settings.slackWebhookUrl;
    else if (provider === "vector-db") keyOrToken = settings.vectorDbApiKey;

    if (!keyOrToken.trim() && !baseUrl.trim() && provider !== "custom") {
      setTestingConnection(null);
      setConnectionStatus((prev) => ({
        ...prev,
        [provider]: { status: "error", msg: "Not configured — Missing API Key or Token" },
      }));
      return;
    }

    try {
      const res = await fetch("/api/settings/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, keyOrToken, baseUrl }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.valid) {
          setConnectionStatus((prev) => ({
            ...prev,
            [provider]: { status: "success", msg: `Connected — Verified (${json.data.latencyMs}ms)` },
          }));
        } else {
          const errDesc = json.data?.message || json.error?.message || "Invalid credential";
          setConnectionStatus((prev) => ({
            ...prev,
            [provider]: { status: "error", msg: `Invalid — ${errDesc}` },
          }));
        }
      } else {
        setConnectionStatus((prev) => ({
          ...prev,
          [provider]: { status: "error", msg: "Error — Server verification request failed" },
        }));
      }
    } catch (err) {
      setConnectionStatus((prev) => ({
        ...prev,
        [provider]: { status: "error", msg: "Error — Network connection failed" },
      }));
    } finally {
      setTestingConnection(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <SettingsHeader saveSuccess={saveSuccess} onSave={handleSave} onReset={handleReset} />

      {/* Success Notifications */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 border flex items-center justify-between"
            style={{ background: "rgba(16, 217, 177, 0.12)", borderColor: "var(--accent)", color: "var(--text)" }}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium">
              <CheckCircle2 size={16} style={{ color: "var(--accent)" }} />
              <span>Configuration successfully saved to local browser storage! All agent modules updated.</span>
            </div>
            <span className="mono-label text-[10px]" style={{ color: "var(--accent)" }}>[SAVED]</span>
          </motion.div>
        )}
        {resetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 border flex items-center gap-2 text-xs font-mono"
            style={{ background: "rgba(255, 181, 71, 0.12)", borderColor: "var(--warn)", color: "var(--text)" }}
          >
            <AlertCircle size={16} style={{ color: "var(--warn)" }} />
            <span>Settings have been reset to factory defaults.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <SettingsTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === "api" && (
          <ApiKeysTab
            settings={settings}
            updateSetting={updateSetting}
            handlePasteClipboard={handlePasteClipboard}
            testConnection={testConnection}
            testingConnection={testingConnection}
            connectionStatus={connectionStatus}
          />
        )}

        {activeTab === "execution" && (
          <AgentExecutionTab settings={settings} updateSetting={updateSetting} />
        )}

        {activeTab === "integrations" && (
          <IntegrationsTab
            settings={settings}
            updateSetting={updateSetting}
            testConnection={testConnection}
            testingConnection={testingConnection}
          />
        )}

        {activeTab === "system" && (
          <SystemPreferencesTab settings={settings} updateSetting={updateSetting} />
        )}

        {activeTab === "health" && (
          <HealthDiagnosticsTab
            settings={settings}
            onClearStorage={() => {
              resetSettingsStorage();
              alert("Cache cleared successfully!");
            }}
          />
        )}
      </div>
    </div>
  );
}
