from pydantic import BaseModel


class DailyBarResponse(BaseModel):
    id: int
    dataset_id: int
    symbol_id: int
    trade_date: str
    open: float
    high: float
    low: float
    close: float
    adjusted_close: float | None
    volume: int | None

    model_config = {"from_attributes": True}


class CandleQueryParams(BaseModel):
    symbol_id: int | None = None
    ticker: str | None = None
    dataset_id: int | None = None
    start_date: str | None = None
    end_date: str | None = None
    limit: int = 500