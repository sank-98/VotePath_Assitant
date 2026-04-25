<h1 align="center">🗳️ VotePath Assistant</h1>

<p align="center">
  <strong>India's AI-powered civic guide for navigating the electoral process</strong><br/>
  Bilingual (Hindi / English) • Accessible • Powered by Gemini AI
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.29-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## Overview

**VotePath Assistant** is a bilingual, accessible web application that guides Indian citizens through every step of the electoral process — from voter registration to casting a vote. It combines curated election data with a Gemini AI–powered conversational assistant so voters can get accurate, context-aware answers in Hindi or English.

### Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Gemini-powered chat that answers Indian election questions in Hindi or English |
| 📅 **Election Timeline** | Step-by-step roadmap personalised to the user's registration status and age |
| 🗺️ **States Election Grid** | Upcoming Lok Sabha & Vidhan Sabha schedules across all Indian states |
| 📚 **Education Section** | Articles and guides on EVMs, VVPAT, voter registration, and polling day |
| 📊 **Democratic Impact** | Visualisations showing voter turnout and democratic data across India |
| 🌐 **Bilingual (Hi/En)** | Full content available in Hindi and English; switchable at any time |
| ♿ **Accessibility** | High-contrast mode, ARIA labels, and keyboard navigation throughout |

---

## Project Structure

```
VotePath_Assistant/
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component and layout
│   ├── index.css                  # Global styles (Tailwind + custom)
│   ├── components/                # React UI components
│   │   ├── AIAssistant.tsx        # Conversational AI chat interface
│   │   ├── Timeline.tsx           # Election step timeline
│   │   ├── StepDetail.tsx         # Detail view for a timeline step
│   │   ├── StatesElectionGrid.tsx # State-by-state election grid
│   │   ├── EducationSection.tsx   # Educational articles/guides
│   │   ├── DemocraticImpact.tsx   # Turnout & impact visualisations
│   │   └── ui/
│   │       └── Tooltip.tsx        # Accessible tooltip component
│   ├── services/
│   │   └── geminiService.ts       # Gemini AI API integration & schema
│   ├── lib/
│   │   ├── decisionEngine.ts      # User context & flow classification
│   │   ├── timelineEngine.ts      # Dynamic election timeline generator
│   │   └── translations.ts        # Hindi / English string catalogue
│   └── data/
│       ├── educationData.ts       # Static education content
│       ├── electionData.ts        # National election step definitions
│       ├── electionFacts.ts       # Fun/important election facts
│       └── indiaElectionData.ts   # State-level election schedule data
├── docs/
│   ├── SETUP.md                   # Detailed local development setup
│   └── API.md                     # Gemini service API reference
├── public/                        # Static assets
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
├── server.ts                      # Express dev server
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── CONTRIBUTING.md                # Contribution guidelines
├── ARCHITECTURE.md                # System design and data flow
└── LICENSE                        # MIT License
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- A **Gemini API key** – get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sank-98/VotePath_Assistant.git
cd VotePath_Assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and set your GEMINI_API_KEY
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build       # Outputs to dist/
npm run preview     # Preview production build locally
```

### Quality Checks

```bash
npm run typecheck   # TypeScript strict validation
npm run lint        # ESLint
npm test            # Vitest test suite
npm run test:coverage
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for the AI assistant |
| `APP_URL` | Optional | Public URL of the deployed app |
| `VITE_GA_MEASUREMENT_ID` | Optional | Google Analytics measurement ID |
| `GOOGLE_CLOUD_PROJECT` | Optional | Google Cloud project metadata for logs |
| `GOOGLE_CLOUD_LOG_NAME` | Optional | Log stream name for structured telemetry |

> **Note:** The `.env.local` file is git-ignored. Never commit secrets.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Express + Vite development server |
| `npm run build` | Production build via Vite |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm run lint` | ESLint with zero warnings |
| `npm test` | Run Vitest once |
| `npm run test:coverage` | Run tests with V8 coverage |
| `npm run format` | Format files with Prettier |
| `npm run clean` | Remove the `dist/` directory |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 19 |
| **Language** | TypeScript 5.8 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **AI** | Google Gemini (`@google/genai`) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Server** | Express + tsx |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## Architecture

For a detailed overview of how the system is designed and how data flows between components, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ for Bharat &nbsp;•&nbsp; Data sourced from the Election Commission of India
</div>
