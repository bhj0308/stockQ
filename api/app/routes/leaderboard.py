from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from api.app.database import get_session
from api.app.models.run import Run
from api.app.models.run_metric import RunMetric
from api.app.models.strategy import Strategy
from api.app.schemas.common import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    dataset_version: str | None = Query(None),
    limit: int = Query(50, le=200),
    session: AsyncSession = Depends(get_session),
):
    query = (
        select(Run, RunMetric, Strategy)
        .join(RunMetric, Run.id == RunMetric.run_id)
        .join(Strategy, Run.strategy_id == Strategy.id)
        .where(Run.status == "completed")
        .where(RunMetric.score.isnot(None))
        .order_by(RunMetric.score.desc())
        .limit(limit)
    )

    if dataset_version:
        from api.app.models.dataset import Dataset

        query = query.join(Dataset, Run.dataset_id == Dataset.id).where(
            Dataset.version == dataset_version
        )

    result = await session.execute(query)
    rows = result.all()

    entries = []
    for rank, (run, metric, strategy) in enumerate(rows, start=1):
        from api.app.models.dataset import Dataset

        ds = await session.get(Dataset, run.dataset_id)
        entries.append(
            LeaderboardEntry(
                rank=rank,
                strategy_name=strategy.name,
                total_return=metric.total_return,
                max_drawdown=metric.max_drawdown,
                score=metric.score,
                trade_count=len(run.orders) if run.orders else None,
                dataset_version=ds.version if ds else "",
            )
        )

    return entries