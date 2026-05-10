# StockQ Architecture

## Locked Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + React + TypeScript | Dashboard UI with charts, file upload, run status, leaderboard |
| UI styling | Tailwind CSS | Fast MVP iteration for dense dashboard work |
| Backend API | FastAPI + Pydantic | Python-native, shares models with worker layer |
| ORM / migrations | SQLAlchemy 2.0 + Alembic | Stable, well-known in Python teams |
| Database | Postgres | Users, datasets, runs, logs, metrics |
| Queue / cache | Redis | Job queue, status fanout |
| Job runner | Dramatiq + Redis | Simpler MVP fit than Celery |
| Sandbox worker | Python worker + Docker per run | One fresh container per execution |
| Storage | S3-compatible object storage | Uploads, extracted files, logs, artifacts |
| Charts | Lightweight Charts (candlestick) + Recharts (equity curve) | Market view and performance charts |
| Auth | JWT via FastAPI | Good enough for MVP |
| Deploy | Docker Compose locally → ECS/Fly.io | MVP → production path |

## Architecture Diagram

```text
Frontend (Next.js/React)
        |
        v
FastAPI app
 - auth
 - datasets API
 - strategy upload API
 - run orchestration API
 - leaderboard API
        |
        +----> Postgres
        |
        +----> Redis queue
        |
        +----> S3 object storage

Redis queue --> Python worker --> Docker sandbox per run
                              --> simulator + scoring
                              --> logs/artifacts/results
```

## Why FastAPI

The platform's critical logic is Python-native: strategy validation, sandbox execution, market-data handling, portfolio simulation, and metric scoring. FastAPI shares models, validation rules, and execution contracts with the worker layer, reducing system friction.

## Why React, not Vue

StockQ is a dashboard product with charting, strategy management, run-state transitions, logs, result views, and leaderboard filtering — not a marketing site or CRUD admin panel. React maps cleanly to these needs and is easier to staff.

## Database Schema

### Core tables

| Table | Purpose | Key relationships |
|---|---|---|
| `users` | Account, auth, plan tier | Has many strategies |
| `symbols` | Supported tickers, exchange, sector | Referenced by bars, orders, positions |
| `datasets` | Versioned market data snapshots | Has many daily_bars |
| `daily_bars` | OHLCV data per symbol per date | Belongs to dataset + symbol |
| `strategies` | User-created strategy metadata | Belongs to user, has many runs |
| `strategy_files` | Uploaded `.py`/`.zip` in S3 | Belongs to strategy |
| `strategy_validations` | Static analysis results | Belongs to strategy |
| `runs` | One strategy execution | Belongs to strategy + dataset |
| `run_logs` | Execution stdout/stderr | Belongs to run |
| `orders` | Simulated trade orders | Belongs to run + symbol |
| `positions` | Daily position snapshots | Belongs to run + symbol |
| `portfolio_snapshots` | Daily portfolio state | Belongs to run |
| `run_metrics` | Computed scores and metrics | One-to-one with run |

### Key design decisions
- All dates stored as ISO-8601 strings (`YYYY-MM-DD` or ISO datetime) for simplicity
- `run_metrics` is one-to-one with `runs` — computed after execution completes
- `daily_bars` is versioned by `dataset_id` so all runs compare against the same data

## API Design

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/symbols` | Symbol universe |
| GET | `/api/candles` | OHLCV bars (filter by symbol, date, dataset) |
| GET | `/api/datasets` | Available dataset versions |
| GET | `/api/watchlist` | Latest snapshot per symbol |
| POST | `/api/strategies` | Create strategy metadata |
| POST | `/api/strategies/{id}/upload` | Upload `.py`/`.zip` |
| GET | `/api/strategies/{id}` | Strategy + validation state |
| POST | `/api/strategies/{id}/validate` | Trigger static validation |
| POST | `/api/runs` | Create run, push to queue |
| GET | `/api/runs/{id}` | Run summary |
| GET | `/api/runs/{id}/logs` | Execution logs |
| GET | `/api/runs/{id}/orders` | Trade history |
| GET | `/api/runs/{id}/portfolio` | Portfolio timeline |
| GET | `/api/runs/{id}/metrics` | Scores and metrics |
| GET | `/api/leaderboard` | Ranked by dataset version |

## Out of Scope for MVP

- No live market execution or broker integrations
- No HFT, tick, or order-book strategies
- No non-Python strategy languages
- No short selling, leverage, or options (v1 is long-only)
- No microservice sprawl — modular monolith
- No Kubernetes requirement on day one