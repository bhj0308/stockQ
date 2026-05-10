from pydantic import BaseModel


class RunLogResponse(BaseModel):
    id: int
    run_id: int
    stream: str
    message: str
    created_at: str

    model_config = {"from_attributes": True}