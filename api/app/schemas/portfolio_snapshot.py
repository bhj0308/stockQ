from pydantic import BaseModel


class PortfolioSnapshotResponse(BaseModel):
    id: int
    run_id: int
    trade_date: str
    cash: float
    gross_exposure: float
    net_liquidation_value: float
    drawdown: float | None

    model_config = {"from_attributes": True}