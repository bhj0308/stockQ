from pydantic import BaseModel


class OrderResponse(BaseModel):
    id: int
    run_id: int
    symbol_id: int
    trade_date: str
    side: str
    quantity: int
    price: float
    reason: str | None

    model_config = {"from_attributes": True}