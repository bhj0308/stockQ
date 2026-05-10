from pydantic import BaseModel


class SymbolResponse(BaseModel):
    id: int
    ticker: str
    name: str | None
    exchange: str | None
    sector: str | None
    is_active: bool

    model_config = {"from_attributes": True}