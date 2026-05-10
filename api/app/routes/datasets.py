from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.database import get_session
from api.app.models.dataset import Dataset
from api.app.schemas.dataset import DatasetResponse

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.get("", response_model=list[DatasetResponse])
async def list_datasets(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Dataset).order_by(Dataset.ingested_at.desc())
    )
    datasets = result.scalars().all()
    return [DatasetResponse.model_validate(d) for d in datasets]


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: int, session: AsyncSession = Depends(get_session)):
    dataset = await session.get(Dataset, dataset_id)
    return DatasetResponse.model_validate(dataset)