// TypeScript types mirroring backend Pydantic schemas (api/app/schemas/)

// Auth
export interface UserCreate {
  email: string;
  display_name: string;
  password: string;
}
export interface UserResponse {
  id: number;
  email: string;
  display_name: string;
  plan_tier: string;
  created_at: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

// Symbols
export interface SymbolResponse {
  id: number;
  ticker: string;
  name: string | null;
  exchange: string | null;
  sector: string | null;
  is_active: boolean;
}

// Daily bars / candles
export interface DailyBarResponse {
  id: number;
  dataset_id: number;
  symbol_id: number;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number | null;
  volume: number | null;
}
export interface CandleQueryParams {
  symbol_id?: number;
  ticker?: string;
  dataset_id?: number;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

// Datasets
export interface DatasetResponse {
  id: number;
  version: string;
  start_date: string;
  end_date: string;
  source_name: string | null;
  ingested_at: string;
  status: string;
  description: string | null;
}

// Watchlist
export interface WatchlistItem {
  ticker: string;
  name: string | null;
  close: number;
  change: number;
  change_pct: number;
  volume: number | null;
}

// Strategies
export interface StrategyCreate {
  name: string;
  description?: string | null;
  entrypoint?: string;
}
export interface StrategyResponse {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  entrypoint: string;
  status: string;
  created_at: string;
}
export interface StrategyListResponse {
  strategies: StrategyResponse[];
  total: number;
}

// Runs
export interface RunCreate {
  strategy_id: number;
  dataset_id: number;
}
export interface RunResponse {
  id: number;
  strategy_id: number;
  dataset_id: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  runtime_ms: number | null;
  exit_code: number | null;
}

// Run logs
export interface RunLogResponse {
  id: number;
  run_id: number;
  stream: string;
  message: string;
  created_at: string;
}

// Orders
export interface OrderResponse {
  id: number;
  run_id: number;
  symbol_id: number;
  trade_date: string;
  side: string;
  quantity: number;
  price: number;
  reason: string | null;
}

// Portfolio
export interface PortfolioSnapshotResponse {
  id: number;
  run_id: number;
  trade_date: string;
  cash: number;
  gross_exposure: number;
  net_liquidation_value: number;
  drawdown: number | null;
}

// Metrics
export interface RunMetricResponse {
  id: number;
  run_id: number;
  total_return: number | null;
  annualized_return: number | null;
  volatility: number | null;
  max_drawdown: number | null;
  sharpe_like: number | null;
  win_rate: number | null;
  turnover: number | null;
  score: number | null;
}

// Positions
export interface PositionResponse {
  id: number;
  run_id: number;
  symbol_id: number;
  trade_date: string;
  quantity: number;
  market_value: number;
  weight: number | null;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  strategy_name: string;
  total_return: number | null;
  max_drawdown: number | null;
  score: number | null;
  trade_count: number | null;
  dataset_version: string;
}

// Common
export interface HealthResponse {
  status: string;
  version: string;
}
export interface ApiError {
  detail: string;
}