from pydantic import BaseModel


class RunCreate(BaseModel):
    strategy_id: int
    dataset_id: int


class RunResponse(BaseModel):
    id: int
    strategy_id: int
    dataset_id: int
    status: str
    started_at: str | None
    completed_at: str | None
    runtime_ms: int | None
    exit_code: int | None

    model_config = {"from_attributes": True}


class RunStatusUpdate(BaseModel):
    status: str
    runtime_ms: int | None = None
    exit_code: int | None = None