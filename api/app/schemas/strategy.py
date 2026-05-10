from pydantic import BaseModel


class StrategyCreate(BaseModel):
    name: str
    description: str | None = None
    entrypoint: str = "run_strategy"


class StrategyResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None
    entrypoint: str
    status: str
    created_at: str

    model_config = {"from_attributes": True}


class StrategyListResponse(BaseModel):
    strategies: list[StrategyResponse]
    total: int