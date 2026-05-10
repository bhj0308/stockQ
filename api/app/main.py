from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.app.config import settings
from api.app.storage import ensure_bucket


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_bucket()
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.app.routes.health import router as health_router
from api.app.routes.auth import router as auth_router
from api.app.routes.symbols import router as symbols_router
from api.app.routes.datasets import router as datasets_router
from api.app.routes.candles import router as candles_router
from api.app.routes.watchlist import router as watchlist_router
from api.app.routes.strategies import router as strategies_router
from api.app.routes.runs import router as runs_router
from api.app.routes.leaderboard import router as leaderboard_router

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(symbols_router)
app.include_router(datasets_router)
app.include_router(candles_router)
app.include_router(watchlist_router)
app.include_router(strategies_router)
app.include_router(runs_router)
app.include_router(leaderboard_router)