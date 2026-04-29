# StockQ

StockQ is a stock market replica and quant algorithm evaluation platform where users submit trading strategies, run them in a controlled simulation environment, and receive ranked results based on shared market conditions.[cite:16][cite:25][cite:28]

## Overview

The product is best framed as a paper-trading and algorithm-ranking system rather than a live-trading platform in its first version.[cite:16][cite:20][cite:28] Users upload or write algorithmic trading logic, the platform executes each run in a sandboxed environment, and the system scores each strategy using the same market window, assumptions, and evaluation metrics so results are comparable.[cite:18][cite:21][cite:25]

## Core Idea

The main goal is to let users test how good their trading algorithm is, not just whether it can place trades.[cite:16][cite:27] To do that fairly, all algorithms should be evaluated with the same market data slice, the same execution constraints, and the same scoring model, which is consistent with established ranking-system design for strategy evaluation.[cite:21][cite:25]

## Product Tiers

| Tier | Price | Usage Model | Queue Priority | Ranking Access |
|------|-------|-------------|----------------|----------------|
| Free Trial | Daily once | Limited test run for evaluation | Lowest | No official ranking |
| Premium | $20/month | Up to 10 runs per day | Faster queue | Ranked on today's market |
| VIP | $1000/month | Dedicated single-instance execution | Highest / isolated | Full ranked access |

These tiers map well to a shared-worker architecture where lower tiers use pooled compute and the highest tier uses isolated compute resources.[cite:28][cite:29]

## User Flow

1. User signs up and selects a plan.
2. User submits a strategy script or algorithm package.
3. The platform verifies the code before execution.
4. The job enters a queue based on plan tier and submission order.
5. A worker instance loads the assigned market data and executes the strategy.
6. The simulator generates trades, logs, portfolio metrics, and final scores.
7. The user sees results and, if eligible, a leaderboard ranking.

Queue-based execution with controlled workers is a practical pattern for scaling many user jobs over fewer compute instances.[cite:28][cite:29]

## Execution Model

Each submission should become a job with a unique ID, for example from 1 to 100000, and move through states such as `queued`, `running`, `completed`, `failed`, or `timed_out`.[cite:29] The worker runner should process jobs in order while respecting tier priority, run a defined strategy loop against replayed market data, and output standardized metrics such as return, drawdown, and trade quality.[cite:16][cite:20][cite:23]

## Safety Limits

Because users may submit arbitrary code, every execution should happen inside a sandbox with strict controls.[cite:18][cite:23]

Recommended first limits:

- Maximum runtime: 1 minute per job.
- No unrestricted outbound network access.
- CPU and memory throttling.
- Allowlisted packages only.
- Automatic timeout and forced termination on abuse.
- Static code verification before execution.
- Full execution logging for debugging and moderation.

These controls are a practical minimum for hosted algorithm execution systems.[cite:18][cite:23]

## Ranking Logic

Ranking should be based on more than raw profit.[cite:16][cite:23] A stronger system would combine metrics such as total return, maximum drawdown, consistency, volatility, win rate, and turnover so the leaderboard rewards robust strategies rather than risky one-off results.[cite:16][cite:25][cite:27]

Example ranking inputs:

- Net return
- Max drawdown
- Risk-adjusted performance
- Win rate
- Trade count
- Slippage and fee assumptions
- Stability across the same replay window

For fairness, only strategies run on the same day's market data, with the same fill assumptions and limits, should be ranked against one another.[cite:21][cite:25]

## Suggested Architecture

A clean first architecture is:

- Frontend web app for signup, submissions, status, and leaderboard.
- API service for authentication, plan checks, and job creation.
- Queue service for ordered execution.
- Worker runners for simulation and scoring.
- Results database for logs, trades, and scores.
- Leaderboard service for ranked output.
- Billing service for subscriptions and usage limits.

Separating queueing, execution, and storage makes it easier to scale workers independently as user volume grows.[cite:23][cite:29]

## MVP Scope

The first version should stay narrow and focus on simulation quality.[cite:16][cite:28]

### Phase 1

- Define supported assets, order types, and trading hours.
- Define the strategy interface for submitted code.
- Build one simulation worker.
- Replay historical or delayed market data.
- Produce logs and summary metrics.

### Phase 2

- Add the queue system.
- Add plan-based limits and queue priority.
- Add daily run caps.
- Add leaderboard logic.
- Add premium-ranked sessions.

### Phase 3

- Add VIP isolated execution.
- Add cost tracking per run.
- Add more robust observability and admin tooling.
- Consider broker integrations only after the paper-trading system is stable.

Most practical bot-building guidance recommends validating strategy logic and simulation infrastructure before enabling real-money execution.[cite:16][cite:22][cite:28]

## Notes on Cost

Your note about a cooldown and per-run compute cost suggests the business model should track job duration, worker count, and resource usage at the run level.[cite:28] That is especially important if premium users can consume faster queues or repeated daily runs, since worker saturation will directly affect both wait times and margins.[cite:28][cite:29]

## Immediate Next Steps

1. Write a one-page product spec with exact rules for assets, order types, and scoring.[cite:20][cite:25]
2. Define the strategy submission API and script format.[cite:18][cite:20]
3. Build a single worker that can run one strategy against one day of data.[cite:16][cite:28]
4. Add sandboxing, timeout, and logs before multi-user rollout.[cite:18][cite:23]
5. Add queue priority and subscriptions only after runs are stable and comparable.[cite:21][cite:29]

## Draft Positioning

StockQ can be positioned as a platform to test, score, and rank trading algorithms in a fair simulated market, with faster execution and dedicated resources available as paid upgrades.[cite:21][cite:25][cite:28]
