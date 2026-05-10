import type {
  TokenResponse,
  UserCreate,
  UserResponse,
  SymbolResponse,
  DailyBarResponse,
  CandleQueryParams,
  DatasetResponse,
  WatchlistItem,
  StrategyCreate,
  StrategyResponse,
  StrategyListResponse,
  RunCreate,
  RunResponse,
  RunLogResponse,
  OrderResponse,
  PortfolioSnapshotResponse,
  RunMetricResponse,
  LeaderboardEntry,
  HealthResponse,
} from "./types";

const TOKEN_KEY = "stockq_token";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (file uploads)
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const detail = await res.json().then((d) => d.detail).catch(() => res.statusText);
      throw new Error(detail);
    }

    return res.json();
  }

  // Health
  async health(): Promise<HealthResponse> {
    return this.request("/health");
  }

  // Auth
  async login(email: string, password: string): Promise<TokenResponse> {
    const result = await this.request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.access_token);
    return result;
  }

  async register(data: UserCreate): Promise<UserResponse> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async me(): Promise<UserResponse> {
    return this.request("/api/auth/me");
  }

  // Market data
  async getSymbols(): Promise<SymbolResponse[]> {
    return this.request("/api/symbols");
  }

  async getCandles(params: CandleQueryParams): Promise<DailyBarResponse[]> {
    const qs = new URLSearchParams();
    if (params.symbol_id) qs.set("symbol_id", String(params.symbol_id));
    if (params.ticker) qs.set("ticker", params.ticker);
    if (params.dataset_id) qs.set("dataset_id", String(params.dataset_id));
    if (params.start_date) qs.set("start_date", params.start_date);
    if (params.end_date) qs.set("end_date", params.end_date);
    if (params.limit) qs.set("limit", String(params.limit));
    return this.request(`/api/candles?${qs.toString()}`);
  }

  async getDatasets(): Promise<DatasetResponse[]> {
    return this.request("/api/datasets");
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return this.request("/api/watchlist");
  }

  // Strategies
  async getStrategies(): Promise<StrategyListResponse> {
    return this.request("/api/strategies");
  }

  async getStrategy(id: number): Promise<StrategyResponse> {
    return this.request(`/api/strategies/${id}`);
  }

  async createStrategy(data: StrategyCreate): Promise<StrategyResponse> {
    return this.request("/api/strategies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async uploadStrategy(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await fetch(`${this.baseUrl}/api/strategies/${id}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken()}` },
      body: formData,
    });
  }

  async validateStrategy(id: number): Promise<void> {
    await this.request(`/api/strategies/${id}/validate`, {
      method: "POST",
    });
  }

  // Runs
  async createRun(data: RunCreate): Promise<RunResponse> {
    return this.request("/api/runs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRun(id: number): Promise<RunResponse> {
    return this.request(`/api/runs/${id}`);
  }

  async getRunLogs(id: number): Promise<RunLogResponse[]> {
    return this.request(`/api/runs/${id}/logs`);
  }

  async getRunOrders(id: number): Promise<OrderResponse[]> {
    return this.request(`/api/runs/${id}/orders`);
  }

  async getRunPortfolio(id: number): Promise<PortfolioSnapshotResponse[]> {
    return this.request(`/api/runs/${id}/portfolio`);
  }

  async getRunMetrics(id: number): Promise<RunMetricResponse> {
    return this.request(`/api/runs/${id}/metrics`);
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request("/api/leaderboard");
  }
}

export const api = new ApiClient();