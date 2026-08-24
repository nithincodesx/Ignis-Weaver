# ⚡ GUILD Enterprise OS — Multi-Agent Intelligence Command Center

![Enterprise OS Banner](https://img.shields.io/badge/NEXT.JS-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TYPESCRIPT-5.4-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TAILWIND_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/FRAMER_MOTION-11.0-ff0055?style=for-the-badge&logo=framer)

> A neo-brutalist, high-performance command center for orchestrating autonomous AI agent networks, managing complex multi-agent workflows, and inspecting real-time system metrics.

---

## 🌟 Features Overview

### 🤖 Multi-Agent Roster
Coordinate specialized autonomous agents, each tailored with dedicated roles, tool access, and skill sets:
- **Paul (Orchestrator)** — Central routing engine managing multi-agent task distribution.
- **Marco (User Researcher)** — Deep user interview analysis and sentiment discovery.
- **Viktor (Backend Engineer)** — Pipeline memory optimization and cluster sync models.
- **Alexis (Product Analyst)** — Requirement translation, telemetry metrics, and product roadmaps.
- **Sarah (UX Designer)** — High-fidelity UI layouts, pixel-perfect brutalist aesthetics.
- **Elena (QA Auditor)** — Integration testing, schema validation, and accessibility compliance.

### 🎮 Command Console & Dispatch
- Direct task dispatching to individual agents or auto-routing through the Orchestrator.
- Multi-mode execution parameters (**Auto-Route**, **Synchronous**, **Streaming Log**).
- Real-time notification banners and task event feedback.

### 📐 Bento Canvas Agent Grid
- Dynamic grid view displaying active agent cards.
- Status indicators (*Active*, *Idle*, *Warning*, *Error*, *Completed*).
- Live efficiency gauges, task completion ratios, and integrated communication tools (Slack, Notion, GitHub, Gmail).

### 💬 Real-Time Agent Activity & Chat
- Streaming activity logs detailing step-by-step reasoning and output updates.
- Agent personality context (Analytical, Strategic, Creative, Technical).
- Interactive messaging with status badges and live thinking indicators.

### 🔀 Prompt Studio & Workflow Visualizer
- Multi-step workflow visualizer tracking task progression across agent nodes.
- Execution time metrics per step with instant action controls (*Play*, *Pause*, *Retry*).

### 📊 Output Inspector & Platform Analytics
- System load metrics including CPU utilization, memory allocation, network I/O, and API latency.
- Live updating charts and telemetry graphs for platform health monitoring.

### 🌓 Cyberpunk / Neo-Brutalist Aesthetic & Theme System
- Dual theme engine support (**Dark Mode** / **Light Mode**) with custom CSS variable tokens.
- Monospaced typography, bracketed UI buttons, sharp borders, and smooth Framer Motion micro-interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom Vanilla CSS Tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed on your system.

```bash
node -v
npm -v
```

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd ENTP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open [http://localhost:3333](http://localhost:3333) in your browser.

---

## 📁 Project Structure

```
ENTP/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global Neo-brutalist theme design system & variables
│   │   ├── layout.tsx           # Next.js root layout with font configuration
│   │   └── page.tsx             # Main dashboard overview & panel layout
│   ├── components/
│   │   ├── AgentCard.tsx        # Bento agent node card component
│   │   ├── AgentChat.tsx        # Live activity log & chat panel
│   │   ├── BentoCanvas.tsx      # Agent grid container & filter toolbar
│   │   ├── CommandConsole.tsx   # Interactive task dispatch command console
│   │   ├── GlassDock.tsx        # Sidebar navigation dock
│   │   ├── OutputInspector.tsx  # Metrics & analytics monitoring panel
│   │   ├── PromptStudio.tsx     # Workflow step-by-step progress visualizer
│   │   └── StatusPill.tsx       # Reusable status pill component
│   └── lib/
│       └── types.ts             # Agent types, role configurations & nav schemas
├── public/                      # Static assets & agent avatars
├── package.json                 # Node.js dependencies & scripts
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js dev server on port `3333` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs Next.js linter check |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for feature requests and bug reports.

---

## 📄 License

Private / Proprietary Enterprise Software.
