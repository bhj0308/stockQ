from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.auth import get_current_user
from api.app.database import get_session
from api.app.models.strategy import Strategy
from api.app.models.strategy_validation import StrategyValidation
from api.app.models.user import User
from api.app.schemas.strategy import StrategyCreate, StrategyResponse
from api.app.storage import get_s3_client, settings

router = APIRouter(prefix="/api/strategies", tags=["strategies"])


@router.post("", response_model=StrategyResponse, status_code=201)
async def create_strategy(
    body: StrategyCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    strategy = Strategy(
        user_id=current_user.id,
        name=body.name,
        description=body.description,
        entrypoint=body.entrypoint,
        status="draft",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    session.add(strategy)
    await session.commit()
    await session.refresh(strategy)
    return StrategyResponse.model_validate(strategy)


@router.get("", response_model=list[StrategyResponse])
async def list_strategies(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Strategy)
        .where(Strategy.user_id == current_user.id)
        .order_by(Strategy.created_at.desc())
    )
    strategies = result.scalars().all()
    return [StrategyResponse.model_validate(s) for s in strategies]


@router.get("/{strategy_id}", response_model=StrategyResponse)
async def get_strategy(
    strategy_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    strategy = await session.get(Strategy, strategy_id)
    if not strategy or strategy.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    return StrategyResponse.model_validate(strategy)


@router.post("/{strategy_id}/upload", status_code=200)
async def upload_strategy_file(
    strategy_id: int,
    file: UploadFile,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    strategy = await session.get(Strategy, strategy_id)
    if not strategy or strategy.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")

    allowed_ext = (".py", ".zip")
    if not any(file.filename.endswith(ext) for ext in allowed_ext):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .py and .zip files are allowed",
        )

    content = await file.read()
    storage_path = f"strategies/{strategy_id}/{file.filename}"

    s3 = next(get_s3_client())
    s3.put_object(
        Bucket=settings.s3_bucket,
        Key=storage_path,
        Body=content,
    )

    from api.app.models.strategy_file import StrategyFile

    sf = StrategyFile(
        strategy_id=strategy_id,
        storage_path=storage_path,
        filename=file.filename,
        file_type=".py" if file.filename.endswith(".py") else ".zip",
        uploaded_at=datetime.now(timezone.utc).isoformat(),
    )
    session.add(sf)
    await session.commit()

    return {"status": "uploaded", "filename": file.filename, "storage_path": storage_path}


@router.post("/{strategy_id}/validate", status_code=200)
async def trigger_validation(
    strategy_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    strategy = await session.get(Strategy, strategy_id)
    if not strategy or strategy.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")

    validation = StrategyValidation(
        strategy_id=strategy_id,
        status="passed",
        validated_at=datetime.now(timezone.utc).isoformat(),
    )
    session.add(validation)
    strategy.status = "validated"
    await session.commit()

    return {"status": "passed", "strategy_id": strategy_id}