from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.database import get_session
from api.app.models.daily_bar import DailyBar
from api.app.models.symbol import Symbol
from api.app.schemas.common import WatchlistItem

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])


@router.get("", response_model=list[WatchlistItem])
async def get_watchlist(
    dataset_id: int | None = None,
    session: AsyncSession = Depends(get_session),
):
    sym_result = await session.execute(
        select(Symbol).where(Symbol.is_active == True).order_by(Symbol.ticker)
    )
    symbols = sym_result.scalars().all()

    items = []
    for sym in symbols:
        bar_query = select(DailyBar).where(DailyBar.symbol_id == sym.id)
        if dataset_id:
            bar_query = bar_query.where(DailyBar.dataset_id == dataset_id)
        bar_query = bar_query.order_by(DailyBar.trade_date.desc()).limit(2)
        bar_result = await session.execute(bar_query)
        bars = bar_result.scalars().all()

        if not bars:
            continue

        latest = bars[0]
        prev_close = bars[1].close if len(bars) > 1 else latest.close
        change = latest.close - prev_close
        change_pct = (change / prev_close * 100) if prev_close else 0.0

        items.append(
            WatchlistItem(
                ticker=sym.ticker,
                name=sym.name,
                close=latest.close,
                change=round(change, 4),
                change_pct=round(change_pct, 4),
                volume=latest.volume,
            )
        )

    return items