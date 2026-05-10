from pydantic import BaseModel


class PositionResponse(BaseModel):
    id: int
    run_id: int
    symbol_id: int
    trade_date: str
    quantity: int
    market_value: float
    weight: float | None

    model_config = {"from_attributes": True}