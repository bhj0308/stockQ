from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: int
    version: str
    start_date: str
    end_date: str
    source_name: str | None
    ingested_at: str
    status: str
    description: str | None

    model_config = {"from_attributes": True}