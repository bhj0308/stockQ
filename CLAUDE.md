# StockQ — Master Contract

StockQ is a stock-market replica and quant algorithm evaluation platform. Users upload Python trading strategies, run them in a sandboxed simulation, and get ranked on a leaderboard against shared market data.

## Reference documents

| File | When to read |
|---|---|
| [architecture.md](architecture.md) | Session involves stack decisions, DB schema, API design |
| [workflow.md](workflow.md) | Before starting a new agent phase — check what's been built |
| [commands.md](commands.md) | Running the dev stack, migrations, tests |

## Session rules

### Think before coding
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity first
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical changes
- Touch only what you must. Clean up only your own mess.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### Goal-driven execution
- Transform tasks into verifiable goals with success criteria.
- For multi-step work, state a brief plan with checkpoints.
- Loop until verified — don't declare a task done without confirming.

## Project conventions

- **Imports**: standard library → third-party → local, with a blank line between groups
- **Python**: FastAPI + Pydantic v2 + SQLAlchemy 2.0 async + Alembic
- **Frontend**: Next.js App Router + TypeScript + Tailwind CSS + TanStack Query
- **Pydantic schemas** in `api/app/schemas/` are the single source of truth for all API contracts
- **API routes** in `api/app/routes/` should be thin — logic lives in `services/`
- **Commits**: conventional commit style (`feat:`, `fix:`, `chore:`, `docs:`)

## Current agent phase

Agent 1 (Backend Core) is complete. Next: Agent 2 (Frontend UI Shell). See [workflow.md](workflow.md) for the full plan.