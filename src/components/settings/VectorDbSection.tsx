"use client";

import React from "react";
import { Database } from "lucide-react";
import { VectorDbType } from "@/lib/settingsTypes";

interface VectorDbSectionProps {
  dbType: VectorDbType;
  endpoint: string;
  apiKey: string;
  onTypeChange: (val: VectorDbType) => void;
  onEndpointChange: (val: string) => void;
  onApiKeyChange: (val: string) => void;
}

export default function VectorDbSection({
  dbType,
  endpoint,
  apiKey,
  onTypeChange,
  onEndpointChange,
  onApiKeyChange,
}: VectorDbSectionProps) {
  return (
    <div className="guild-card p-5 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border-dim)" }}>
        <Database size={16} style={{ color: "var(--accent)" }} />
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Vector Database (RAG & Memory Persistence)</h3>
          <p className="mono-label text-[10px]">Connect Pinecone, Qdrant or local embedding stores for long-term agent memory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">VECTOR DB TYPE</label>
          <select
            value={dbType}
            onChange={(e) => onTypeChange(e.target.value as VectorDbType)}
            className="g-input w-full text-xs"
          >
            <option value="local">Local Browser Memory (In-Memory Index)</option>
            <option value="qdrant">Qdrant Vector DB</option>
            <option value="pinecone">Pinecone Cloud DB</option>
            <option value="weaviate">Weaviate Cluster</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">ENDPOINT URL</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
            placeholder="http://localhost:6333"
            className="g-input w-full text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="mono-label block text-[10px]">VECTOR DB API KEY</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Vector DB Key"
            className="g-input w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
