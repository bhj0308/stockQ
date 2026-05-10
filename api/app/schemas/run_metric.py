from pydantic import BaseModel


class RunMetricResponse(BaseModel):
    id: int
    run_id: int
    total_return: float | None
    annualized_return: float | None
    volatility: float | None
    max_drawdown: float | None
    sharpe_like: float | None
    win_rate: float | None
    turnover: float | None
    score: float | None

    model_config = {"from_attributes": True}