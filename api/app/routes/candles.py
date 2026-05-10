from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.database import get_session
from api.app.models.daily_bar import DailyBar
from api.app.models.symbol import Symbol
from api.app.schemas.daily_bar import DailyBarResponse

router = APIRouter(prefix="/api/candles", tags=["candles"])


@router.get("", response_model=list[DailyBarResponse])
async def get_candles(
    symbol_id: int | None = Query(None),
    ticker: str | None = Query(None),
    dataset_id: int | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    limit: int = Query(500, le=5000),
    session: AsyncSession = Depends(get_session),
):
    query = select(DailyBar)

    if ticker:
        sym_result = await session.execute(
            select(Symbol.id).where(Symbol.ticker == ticker)
        )
        sym_id = sym_result.scalar_one_or_none()
        if sym_id is None:
            return []
        query = query.where(DailyBar.symbol_id == sym_id)
    elif symbol_id:
        query = query.where(DailyBar.symbol_id == symbol_id)

    if dataset_id:
        query = query.where(DailyBar.dataset_id == dataset_id)
    if start_date:
        query = query.where(DailyBar.trade_date >= start_date)
    if end_date:
        query = query.where(DailyBar.trade_date <= end_date)

    query = query.order_by(DailyBar.trade_date).limit(limit)
    result = await session.execute(query)
    bars = result.scalars().all()
    return [DailyBarResponse.model_validate(b) for b in bars]