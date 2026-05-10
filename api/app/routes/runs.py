from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.auth import get_current_user
from api.app.database import get_session
from api.app.models.run import Run
from api.app.models.run_log import RunLog
from api.app.models.user import User
from api.app.schemas.run import RunCreate, RunResponse
from api.app.schemas.run_log import RunLogResponse
from api.app.schemas.run_metric import RunMetricResponse
from api.app.schemas.order import OrderResponse
from api.app.schemas.position import PositionResponse
from api.app.schemas.portfolio_snapshot import PortfolioSnapshotResponse

router = APIRouter(prefix="/api/runs", tags=["runs"])


@router.post("", response_model=RunResponse, status_code=201)
async def create_run(
    body: RunCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    from api.app.models.strategy import Strategy

    strategy = await session.get(Strategy, body.strategy_id)
    if not strategy or strategy.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")

    run = Run(
        strategy_id=body.strategy_id,
        dataset_id=body.dataset_id,
        status="queued",
        started_at=datetime.now(timezone.utc).isoformat(),
    )
    session.add(run)
    await session.commit()
    await session.refresh(run)

    # Push to Redis queue via Dramatiq
    from api.app.services.execution import enqueue_run

    await enqueue_run(run.id)

    return RunResponse.model_validate(run)


@router.get("/{run_id}", response_model=RunResponse)
async def get_run(
    run_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    run = await session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    from api.app.models.strategy import Strategy

    strategy = await session.get(Strategy, run.strategy_id)
    if strategy and strategy.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    return RunResponse.model_validate(run)


@router.get("/{run_id}/logs", response_model=list[RunLogResponse])
async def get_run_logs(
    run_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    run = await session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    result = await session.execute(
        select(RunLog).where(RunLog.run_id == run_id).order_by(RunLog.created_at)
    )
    logs = result.scalars().all()
    return [RunLogResponse.model_validate(log) for log in logs]


@router.get("/{run_id}/orders", response_model=list[OrderResponse])
async def get_run_orders(
    run_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    from api.app.models.order import Order

    run = await session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    result = await session.execute(
        select(Order).where(Order.run_id == run_id).order_by(Order.trade_date)
    )
    orders = result.scalars().all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{run_id}/portfolio", response_model=list[PortfolioSnapshotResponse])
async def get_run_portfolio(
    run_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    run = await session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    result = await session.execute(
        select(PortfolioSnapshot.model)
        .where(PortfolioSnapshot.model.run_id == run_id)
        .order_by(PortfolioSnapshot.model.trade_date)
    )
    snapshots = result.scalars().all()
    return [PortfolioSnapshotResponse.model_validate(s) for s in snapshots]


@router.get("/{run_id}/metrics", response_model=RunMetricResponse)
async def get_run_metrics(
    run_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    from api.app.models.run_metric import RunMetric

    run = await session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    result = await session.execute(
        select(RunMetric).where(RunMetric.run_id == run_id)
    )
    metric = result.scalar_one_or_none()
    if not metric:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics not available")
    return RunMetricResponse.model_validate(metric)