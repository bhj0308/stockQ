# StockQ Agentic Build Workflow

This file defines the AI agents that build StockQ, their order, and how they hand off. Each agent is a focused Claude Code session targeting a specific layer.

## Agent Map

```
                    ┌─────────────────────┐
                    │   Agent 0: Found.   │
                    └──────┬──────────────┘
                           ▼
              ┌────────────────────────────┐
              │ Agent 1: Backend Core      │  ◄── DONE
              │ FastAPI + DB + Redis       │
              └────┬───────────────┬───────┘
                   │               │
         ┌─────────▼──────┐  ┌────▼──────────┐
         │ Agent 2: Front │  │ Agent 5: Worker│
         │  End UI Shell  │  │  Docker +      │
         │  Next.js+React │  │  Sandbox       │
         └────────┬───────┘  └───────┬────────┘
                  │                  │
         ┌────────▼───────┐  ┌──────▼─────────┐
         │ Agent 3: Market │  │ Agent 6: Sim + │
         │  Data + Charts  │  │  Scoring       │
         └────────┬───────┘  └──────┬──────────┘
                  │                  │
         ┌────────▼───────┐  ┌──────▼─────────┐
         │ Agent 4: Strat │  │ Agent 7: Leader │
         │  Upload + Runs │  │  board + Polish │
         └────────────────┘  └─────────────────┘
```

## Agents

### Agent 0: Foundation
**Deliverables**: CLAUDE.md, architecture.md, workflow.md, commands.md, README.md
**Status**: Done

### Agent 1: Backend Core
**Goal**: FastAPI app, SQLAlchemy models, Alembic migration, Redis/Dramatiq, S3 client, JWT auth, all route stubs
**Files owned**: `api/app/` (models, schemas, routes, services, config, database, auth, storage, redis)
**Contracts exported**: Pydantic schemas in `api/app/schemas/` — single source of truth for data shapes
**Status**: Done

### Agent 2: Frontend UI Shell
**Goal**: Next.js + Tailwind with 4 pages (Market, Strategy Upload, Run Details, Leaderboard), navigation, API client
**Depends on**: Agent 1 schemas (can start with mock data)
**How to launch**: `claude-code -p "Build Agent 2: Frontend UI Shell. See workflow.md for spec."`

### Agent 3: Market Data + Charts
**Goal**: Ingestion pipeline, candle/watchlist APIs, candlestick chart component, wire chart to real data
**Depends on**: Agent 1 (API + DB), Agent 2 (frontend shell)

### Agent 4: Strategy Upload + Runs
**Goal**: File upload, .zip extraction, static validation, run creation, frontend forms
**Depends on**: Agent 1, 2, 3

### Agent 5: Worker + Docker Sandbox
**Goal**: Dramatiq worker consuming Redis jobs, Docker sandbox per run, log capture, resource limits
**Depends on**: Agent 1 (Redis queue, run schema), Agent 4 (queue push)

### Agent 6: Simulation + Scoring
**Goal**: Fill engine, position tracking, equity curve, metrics, composite score, feedback engine
**Depends on**: Agent 1 (models), Agent 5 (worker execution)

### Agent 7: Leaderboard + Polish
**Goal**: Leaderboard endpoint + UI, wire all pages to real data, loading/empty/error states, final test pass
**Depends on**: All prior agents

## Dependency Table

| Agent | Depends on | Provides to |
|---|---|---|
| 0: Foundation | Nothing | Architecture docs, agent plan |
| 1: Backend Core | Agent 0 | Schemas, DB models, Redis, auth |
| 2: UI Shell | Agent 1 | Page layouts, navigation, API client |
| 3: Market Data | Agent 1, 2 | Ingested data, chart, watchlist endpoint |
| 4: Strategy Upload | Agent 1, 2, 3 | Upload/validation/run-creation + UI |
| 5: Worker Sandbox | Agent 1, 4 | Docker worker, log capture |
| 6: Simulation + Scoring | Agent 1, 5 | Fill engine, metrics, score, feedback |
| 7: Leaderboard + Polish | All prior | Leaderboard, final wiring, release polish |

## Parallel tracks

After Agents 1 and 2, the work splits:
- **Track A (Frontend)**: Agent 2 → Agent 3 → Agent 4
- **Track B (Worker)**: Agent 5 → Agent 6

Tracks converge into Agent 7.

## Shared contract principle

All agents agree on data shapes through Agent 1's Pydantic schemas. If an agent needs to change a shared contract, it updates the schema first. This prevents drift between frontend and worker tracks.

## Session tips

- Each agent session re-reads CLAUDE.md + relevant deliverables from predecessor agents
- Use `/compact` in long sessions to stay under context limits
- Keep `uvicorn` and `npm run dev` running in separate terminals
- Commit and push when each agent finishes