from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.database import get_session
from api.app.models.symbol import Symbol
from api.app.schemas.symbol import SymbolResponse

router = APIRouter(prefix="/api/symbols", tags=["symbols"])


@router.get("", response_model=list[SymbolResponse])
async def list_symbols(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Symbol).where(Symbol.is_active == True).order_by(Symbol.ticker)
    )
    symbols = result.scalars().all()
    return [SymbolResponse.model_validate(s) for s in symbols]


@router.get("/{symbol_id}", response_model=SymbolResponse)
async def get_symbol(symbol_id: int, session: AsyncSession = Depends(get_session)):
    symbol = await session.get(Symbol, symbol_id)
    return SymbolResponse.model_validate(symbol)