"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Zap, Clock, CheckCircle2, AlertTriangle, Activity, Cpu, Layers } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: React.ComponentType<{ size?: number }>;
  accentColor: string;
  sparkline: number[];
}

const METRICS: Metric[] = [
  { id:"m1", label:"Tasks Completed", value:"185", change:"+12", changeType:"up", icon:CheckCircle2, accentColor:"#10D9B1", sparkline:[4,7,5,8,6,9,11,8,12,10,14,12] },
  { id:"m2", label:"Avg Response",    value:"1.8s",  change:"-0.4s", changeType:"up", icon:Clock, accentColor:"#5B8DEF", sparkline:[8,7,6,7,5,6,4,5,3,4,2,2] },
  { id:"m3", label:"Token Usage",     value:"248K",  change:"+32K",  changeType:"neutral", icon:Zap, accentColor:"#FFB547", sparkline:[5,6,8,7,9,8,10,9,11,10,12,14] },
  { id:"m4", label:"Error Rate",      value:"0.3%",  change:"-0.1%", changeType:"up", icon:AlertTriangle, accentColor:"#FF4D6A", sparkline:[6,5,4,5,3,4,3,2,3,2,1,1] },
];

const AGENT_PERF = [
  { name:"PAUL",   val:96, color:"#10D9B1" },
  { name:"MARCO",  val:92, color:"#5B8DEF" },
  { name:"VIKTOR", val:87, color:"#8b5cf6" },
  { name:"ALEXIS", val:78, color:"#f59e0b" },
  { name:"SARAH",  val:85, color:"#ec4899" },
  { name:"ELENA",  val:63, color:"#06b6d4" },
];

const changeIcon = { up: TrendingUp, down: TrendingDown, neutral: Minus };
const changeColor = { up:"#10D9B1", down:"#FF4D6A", neutral:"var(--text-muted)" };

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-7 mt-1.5">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height:`${(v/max)*100}%` }}
          transition={{ delay: i * 0.03, duration: 0.4, ease:"easeOut" }}
          className="spark-bar flex-1"
          style={{ background: i === data.length - 1 ? color : `${color}45`, minWidth:2 }}
        />
      ))}
    </div>
  );
}

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>(METRICS);

  useEffect(() => {
    const iv = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        sparkline: [...m.sparkline.slice(1), Math.max(0.5, m.sparkline[m.sparkline.length-1] + (Math.random()*4-2))],
      })));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="guild-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor:"var(--border-dim)" }}>
        <Activity size={13} style={{ color:"var(--accent)" }} />
        <span className="mono-label" style={{ color:"var(--text)", fontSize:11 }}>PERFORMANCE METRICS</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* KPI cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => {
            const CIcon = changeIcon[m.changeType];
            const MIcon = m.icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity:0, y:8 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.06 }}
                className="p-3 border"
                style={{ background:"var(--surface)", borderColor:"var(--border-dim)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <MIcon size={13} style={{ color: m.accentColor }} />
                  <span className="mono-label flex items-center gap-0.5" style={{ color:changeColor[m.changeType] }}>
                    <CIcon size={9} />
                    {m.change}
                  </span>
                </div>
                <p className="text-lg font-bold" style={{ color:"var(--text)" }}>{m.value}</p>
                <p className="mono-label">{m.label}</p>
                <Sparkline data={m.sparkline} color={m.accentColor} />
              </motion.div>
            );
          })}
        </div>

        {/* Agent efficiency bars */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Layers size={11} style={{ color:"var(--text-muted)" }} />
            <span className="mono-label" style={{ fontSize:10 }}>AGENT EFFICIENCY</span>
          </div>
          {AGENT_PERF.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity:0, x:-8 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3 + i*0.05 }}
              className="flex items-center gap-3"
            >
              <span className="mono-label w-14 truncate" style={{ color:"var(--text)" }}>{a.name}</span>
              <div className="flex-1 h-[5px]" style={{ background:"var(--border-dim)" }}>
                <motion.div
                  className="h-full"
                  style={{ background:a.color }}
                  initial={{ width:0 }}
                  animate={{ width:`${a.val}%` }}
                  transition={{ delay:0.4+i*0.05, duration:0.6, ease:"easeOut" }}
                />
              </div>
              <span className="mono-label w-8 text-right">{a.val}%</span>
            </motion.div>
          ))}
        </div>

        {/* System status */}
        <div className="p-3 border" style={{ background:"var(--surface)", borderColor:"var(--border-dim)" }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Cpu size={11} style={{ color:"var(--accent)" }} />
            <span className="mono-label" style={{ fontSize:10 }}>SYSTEM STATUS</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ l:"Uptime", v:"99.97%" }, { l:"Memory", v:"67.3%" }, { l:"Queue", v:"3 tasks" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{s.v}</p>
                <p className="mono-label">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
