# CommitCoach

**Build your first project. Understand every step.**

CommitCoach is a beginner-friendly project mentor designed to help first-time builders go from an idea to a shipped project without hiding the learning process.

Instead of simply generating code, CommitCoach turns a project into a small, structured learning journey:

**Idea → Missions → Build → Get Stuck → Learn → Fix → Commit → Reflect → Ship**

The goal is simple: help beginners understand **what they are building, why it works, what went wrong, and how their project evolved**.

---

## Why CommitCoach?

Starting your first software project can feel overwhelming.

You may know what you want to build, but not:

* where to start
* what to learn first
* how to approach the next step
* how to debug when something breaks
* how to know whether you are actually learning

CommitCoach breaks that experience into manageable missions.

Each mission gives the builder:

* a clear objective
* the concept they are learning
* a practical challenge
* an estimated time
* explanations and hints
* an "I'm stuck" mentor flow
* a reflection step

The result is more than a finished project.

It is a visible record of the builder's **learning journey and project journey**.

---

## Core Experience

### 1. Start with an Idea

Choose a project name, select a project type, and define the starting point.

Supported project types include:

* Web App
* Mobile App
* Game
* AI Tool
* Other

---

### 2. Build Through Missions

CommitCoach creates a structured five-mission journey based on the selected project type.

Only the current mission is active, while later missions remain locked until the builder completes the previous step.

This creates a simple progression:

**Learn → Build → Reflect → Unlock**

---

### 3. Learn When You Need Help

Every mission includes three mentor modes:

**Explain this**
Get a beginner-friendly explanation of the current concept.

**Give me a hint**
Receive progressive hints rather than immediately receiving a complete solution.

**I'm stuck**
Describe the problem and get guided debugging help.

The mentor is intentionally designed to teach instead of taking over the project.

---

### 4. Reflect on the Build

Before completing a mission, the builder can record:

* What went wrong?
* What did you change?
* What did you learn?

At least one reflection is required to complete a mission.

Reflections are saved locally and restored when the project is reopened.

---

### 5. Connect the Real GitHub Project

CommitCoach can analyze a **public GitHub repository** and reveal the project's actual development activity.

The GitHub analyzer can display:

* repository name
* description
* language
* default branch
* commits analyzed
* active development days
* latest commit
* README presence
* iteration signals
* feature/fix commit signals
* chronological commit timeline
* links back to GitHub

CommitCoach does not invent commit activity.

The project journey is based on the repository's public GitHub history.

---

### 6. See the Story of the Project

The final **Shipped** view combines the learning data with GitHub activity.

It shows:

* mission progress
* concepts learned
* reflections written
* streak information
* GitHub commit activity
* active days
* iteration signals
* the overall learning journey
* the overall project journey

The idea is to make the first project feel like a story of progress rather than just a final piece of software.

---

# Features

## Mission Engine

CommitCoach uses deterministic, data-driven mission templates for different project types.

Mission progression is stored locally and survives page refreshes.

The final mission marks the journey as complete and records a completion timestamp.

---

## AI Mentor

The mentor is powered by an optional server-side OpenAI integration.

When configured, the Bolt Database Edge Function calls:

**OpenAI `gpt-4o-mini`**

The mentor receives relevant project and mission context and is instructed to provide beginner-friendly guidance.

The system supports:

* explanations
* progressive hints
* stuck/debugging guidance
* constrained code examples

The mentor cannot directly complete missions for the user.

### Fallback behavior

CommitCoach is designed to remain usable even when the AI service is unavailable.

It includes deterministic built-in mentor responses for fallback scenarios such as:

* missing API configuration
* API failures
* malformed responses
* timeouts

This allows the core learning experience to continue without depending entirely on a live AI response.

---

## GitHub Repository Analysis

The GitHub integration uses public GitHub REST API data through a server-side Edge Function.

A GitHub token is not required for the normal public-repository flow.

The analyzer retrieves repository metadata and recent commit information, including file-change counts for analyzed commits.

The application provides user-friendly handling for common problems such as:

* invalid repository URLs
* repositories that cannot be found
* private repositories
* GitHub rate limits
* network failures

No GitHub OAuth login is required.

---

## Privacy by Design

CommitCoach keeps its core project state on the user's device using `localStorage`.

The application does not require account creation for the main learning flow.

Mentor conversation data is not stored as persistent chat history in local storage.

The GitHub feature is designed around public repositories and public GitHub data.

---

# Technology Stack

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Supabase / Bolt Database Edge Functions**
* **OpenAI `gpt-4o-mini`** for the optional AI mentor
* **GitHub REST API** for public repository analysis
* **localStorage** for local project and learning-state persistence

---

# Architecture

CommitCoach uses a lightweight client-first architecture.

```text
                    ┌──────────────────────┐
                    │      CommitCoach     │
                    │      React + TS      │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Local Project       AI Mentor        GitHub Analysis
      State / Progress    Edge Function      Edge Function
             │                 │                 │
             │                 ▼                 ▼
             │            OpenAI API        GitHub REST API
             │
             ▼
        Shipped Story
```

### Client

The React application manages:

* routing
* project setup
* mission progression
* reflections
* dashboard state
* mentor UI
* GitHub results
* shipped-page presentation

### Storage

Local project state is persisted with `localStorage`.

This keeps the core experience simple and avoids requiring authentication or a traditional application database.

### Edge Functions

Two server-side functions handle external integrations:

**`github-analyze`**

Retrieves and processes public GitHub repository information.

**`mentor` / mentor Edge Function**

Handles AI mentor requests and keeps the OpenAI API key server-side.

---

# Project Structure

A simplified view of the project:

```text
CommitCoach/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── data/
│   ├── types/
│   └── ...
├── supabase/
│   └── functions/
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

The exact implementation may evolve, but the major separation is between:

* reusable UI components
* route/page experiences
* mission data
* local storage services
* external integration services
* server-side Edge Functions

---

# Running Locally

## Requirements

* Node.js
* npm
* a modern web browser

## Installation

Clone the repository:

```bash
git clone https://github.com/nomailboggymen-lgtm/CommitCoach.git
cd CommitCoach
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL provided by Vite.

---

# Production Build

Create a production build with:

```bash
npm run build
```

The generated application can then be deployed to a static hosting provider such as Netlify or another Vite-compatible hosting platform.

---

# AI Configuration

The AI mentor integration uses a server-side OpenAI API key.

The key should be configured as a server-side secret for the mentor Edge Function.

**Do not expose the OpenAI API key in client-side code or commit it to GitHub.**

Without the API key, CommitCoach can use its built-in deterministic mentor fallback so the core product remains usable.

---

# Privacy & Data Handling

CommitCoach was intentionally designed to minimize unnecessary data collection.

### Local project data

Project information, mission progress, and reflections are persisted locally in the browser.

### AI mentor

Mentor requests are sent through the server-side Edge Function when live AI is configured.

The OpenAI secret is kept server-side rather than embedded in the browser.

### GitHub

The GitHub integration is intended for public repositories and reads publicly available repository information.

CommitCoach does not require GitHub account credentials or OAuth for repository analysis.

---

# Design Principles

CommitCoach follows a few principles throughout the experience:

### Teach before solving

The mentor should help a beginner understand the problem instead of simply dumping a final answer.

### Small steps

A large first project becomes much easier when divided into manageable missions.

### Reflection matters

A completed task is more valuable when the builder can explain what happened and what they learned.

### Show real progress

GitHub activity provides evidence of the actual development journey.

### Stay beginner-friendly

The interface avoids unnecessary complexity and emphasizes clear language, visible progress, and one meaningful action at a time.

---

# AI Disclosure

AI was used during the development of CommitCoach as a development and productivity aid, including assistance with implementation, debugging, code generation, and refinement.

The submitted application also includes an AI-powered mentor feature using OpenAI `gpt-4o-mini`.

The AI mentor is designed as a learning aid. It provides explanations, progressive hints, and debugging guidance rather than automatically completing the project's missions.

The developer reviewed and integrated the generated implementation and remains responsible for the project's final code, architecture, behavior, and design.

---

# External Resources & Credits

### OpenAI

Used for the optional AI mentor functionality.

https://openai.com/

### GitHub

Used through the public GitHub REST API for repository and commit analysis.

https://github.com/

### Supabase

Used for server-side Edge Functions through the project environment.

https://supabase.com/

### Vite

Used as the frontend build tool.

https://vite.dev/

### React

Used for the application UI and component architecture.

https://react.dev/

### Tailwind CSS

Used for styling and responsive UI implementation.

https://tailwindcss.com/

---

# What I Learned

Building CommitCoach was as much about learning as it was about shipping the application.

The biggest lesson was that a beginner product should not only answer:

**"How do I build this?"**

It should also answer:

**"What am I learning while I build it?"**

That led to the mission system, required reflections, progressive mentoring, and the final learning-journey view.

Another important lesson was the value of connecting the learning experience to the actual project history. GitHub makes iteration visible, while reflections make the learning behind those iterations visible.

Together, those two layers turn a first project into something that can be understood, explained, and remembered.

---

# Future Ideas

Possible future improvements include:

* richer GitHub commit insights
* optional GitHub authentication for private repositories
* more project types and mission templates
* stronger personalized mentor context
* project milestones and badges
* shareable learning-journey pages
* additional deployment integrations
* persistent accounts and cross-device project history

These are intentionally outside the current MVP so the first experience stays simple.

---

# Hackathon

Built for **Beginner's Paradise — FirstCommit**.

CommitCoach is designed around the spirit of the challenge:

> **Your first project. Your first commit. Your future.**

The project focuses on making the journey of learning, building, iterating, and shipping visible.

---

# Author

Built by **nomailboggymen-lgtm**.

Repository:

https://github.com/nomailboggymen-lgtm/CommitCoach
