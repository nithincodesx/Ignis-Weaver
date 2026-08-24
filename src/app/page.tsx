"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Activity, Zap, Shield, CheckCircle2, Users, Clock, Sun, Moon } from "lucide-react";
import Sidebar from "@/components/GlassDock";
import AgentGrid from "@/components/BentoCanvas";
import ActivityFeed from "@/components/AgentChat";
import WorkflowView from "@/components/PromptStudio";
import MetricsPanel from "@/components/OutputInspector";
import CommandConsole from "@/components/CommandConsole";

// ── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-3 py-1.5 border transition-colors"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <motion.div
        key={dark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {dark ? <Sun size={13} /> : <Moon size={13} />}
      </motion.div>
      <span className="mono-label" style={{ fontSize: 10, color: "var(--text)" }}>
        {dark ? "LIGHT" : "DARK"}
      </span>
    </motion.button>
  );
}

// ── KPI Badge ────────────────────────────────────────────────────────────────
function KPI({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)" }}>
      <Icon size={12} style={{ color: "var(--accent)" }} />
      <span className="mono-label" style={{ color: "var(--text-dim)" }}>{label}:</span>
      <span className="text-[11px] font-bold font-mono" style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}

// ── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }));
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)" }}>
      <Clock size={11} style={{ color: "var(--text-muted)" }} />
      <span className="mono-label" style={{ fontSize: 10 }}>{time}</span>
    </div>
  );
}

// ── Top-Level Stats Row ───────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { label:"ACTIVE AGENTS",  value:"6",     icon:Users,        change:"+1"  },
    { label:"TASKS TODAY",    value:"185",   icon:CheckCircle2, change:"+34" },
    { label:"AVG LATENCY",    value:"1.8s",  icon:Zap,          change:"-0.4s" },
    { label:"SUCCESS RATE",   value:"99.7%", icon:Shield,       change:"+0.2%" },
  ];
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay: i*0.06, type:"spring", stiffness:280, damping:25 }}
          className="guild-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xl font-extrabold" style={{ color:"var(--text)" }}>{s.value}</p>
            <p className="mono-label mt-0.5">{s.label}</p>
            <p className="mono-label mt-0.5" style={{ color:"var(--accent)" }}>{s.change} TODAY</p>
          </div>
          <div className="w-9 h-9 flex items-center justify-center border" style={{ background:"var(--surface)", borderColor:"var(--border-dim)" }}>
            <s.icon size={17} style={{ color:"var(--accent)" }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Nav Bracket Button ────────────────────────────────────────────────────────
function NavBtn({ id, label, active, onClick }: { id:string; label:string; active:boolean; onClick:()=>void }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 mono-label transition-colors"
      style={{
        fontSize: 11,
        color: active ? "var(--text)" : "var(--text-muted)",
      }}
    >
      {active && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor:"var(--accent)" }}/>
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" style={{ borderColor:"var(--accent)" }}/>
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" style={{ borderColor:"var(--accent)" }}/>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor:"var(--accent)" }}/>
        </>
      )}
      {label}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GuildDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [lastDispatchedTask, setLastDispatchedTask] = useState<string | null>(null);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const handleTaskDispatch = (task: { prompt: string; agent: string; mode: string }) => {
    setLastDispatchedTask(`Dispatched "${task.prompt.slice(0, 30)}..." to ${task.agent.toUpperCase()} (${task.mode})`);
  };

  const renderContent = () => {
    switch (activePanel) {
      case "dashboard":
        return (
          <div className="space-y-5">
            <StatsRow />

            {/* User Input Command Console Section */}
            <CommandConsole onDispatch={handleTaskDispatch} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5" style={{ minHeight: 520 }}>
              <div className="xl:col-span-2">
                <AgentGrid />
              </div>
              <div style={{ height: 560 }}>
                <ActivityFeed />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5" style={{ minHeight: 440 }}>
              <div style={{ height: 460 }}>
                <WorkflowView />
              </div>
              <div style={{ height: 460 }}>
                <MetricsPanel />
              </div>
            </div>
          </div>
        );
      case "manage":
        return (
          <div className="space-y-5">
            {/* User Input Section embedded in Manage view */}
            <CommandConsole onDispatch={handleTaskDispatch} />
            <AgentGrid />
          </div>
        );
      case "workflows":
        return (
          <div className="space-y-5">
            <CommandConsole onDispatch={handleTaskDispatch} />
            <div style={{ height: "calc(100vh - 320px)" }}><WorkflowView /></div>
          </div>
        );
      case "analytics":
        return <div style={{ height: "calc(100vh - 160px)" }}><MetricsPanel /></div>;
      case "settings":
        return (
          <div className="guild-card p-8 text-center">
            <Shield size={36} style={{ margin: "0 auto 12px", color: "var(--text-muted)" }} />
            <p className="mono-label" style={{ fontSize: 12 }}>SETTINGS MODULE</p>
            <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>Configuration panel — coming soon</p>
          </div>
        );
      default:
        return <StatsRow />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* Main */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 0 }}>
        {/* Top Navigation Bar */}
        <header className="guild-header flex items-center justify-between px-6 py-0 flex-shrink-0" style={{ height: 60 }}>
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <div className="guild-logo-box flex items-center justify-center px-2 py-1 text-xs font-black font-mono" style={{ color: "var(--border)" }}>
              [ ]
            </div>
            <span className="font-black text-sm font-mono tracking-widest" style={{ color: "var(--text)" }}>[GUILD]</span>
          </div>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <NavBtn id="dashboard" label="DASHBOARD" active={activePanel === "dashboard"} onClick={() => setActivePanel("dashboard")} />
            <NavBtn id="manage" label="MANAGE" active={activePanel === "manage"} onClick={() => setActivePanel("manage")} />
            <NavBtn id="workflows" label="WORKFLOWS" active={activePanel === "workflows"} onClick={() => setActivePanel("workflows")} />
            <NavBtn id="analytics" label="ANALYTICS" active={activePanel === "analytics"} onClick={() => setActivePanel("analytics")} />
          </div>

          {/* Right: KPIs, time, search, toggle, notif */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2">
              <KPI icon={Users} label="AGENTS" value="6 Active" />
              <KPI icon={CheckCircle2} label="TASKS" value="185 Done" />
              <KPI icon={Shield} label="STATUS" value="Healthy" />
            </div>
            <LiveClock />
            <div className="relative hidden md:block">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input type="text" placeholder="SEARCH..." className="g-input pl-7 py-1.5 text-[11px] w-36" />
            </div>
            <ThemeToggle dark={darkMode} onToggle={() => setDarkMode(d => !d)} />
            <button className="relative p-2 border" style={{ background: "var(--card)", borderColor: "var(--border-dim)", color: "var(--text-dim)" }}>
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full g-pulse" style={{ background: "#FF4D6A" }} />
            </button>
          </div>
        </header>

        {/* Section label bar */}
        <div className="flex items-center justify-between border-b px-6 py-2.5" style={{ background: "var(--surface)", borderColor: "var(--border-dim)" }}>
          <h1 className="mono-label" style={{ fontSize: 14, color: "var(--text)", letterSpacing: "0.08em" }}>
            {activePanel === "dashboard" ? "DASHBOARD OVERVIEW"
              : activePanel === "manage" ? "MANAGE AGENTS"
              : activePanel === "workflows" ? "ACTIVE WORKFLOWS"
              : activePanel === "analytics" ? "PLATFORM ANALYTICS"
              : "SETTINGS"}
          </h1>
          {lastDispatchedTask && (
            <span className="mono-label text-[10px] text-emerald-500 animate-pulse">
              ⚡ {lastDispatchedTask}
            </span>
          )}
        </div>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
