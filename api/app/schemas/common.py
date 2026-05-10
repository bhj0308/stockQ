from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    version: str = "0.1.0"


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int = 1
    page_size: int = 50


class WatchlistItem(BaseModel):
    ticker: str
    name: str | None
    close: float
    change: float
    change_pct: float
    volume: int | None


class LeaderboardEntry(BaseModel):
    rank: int
    strategy_name: str
    total_return: float | None
    max_drawdown: float | None
    score: float | None
    trade_count: int | None
    dataset_version: str