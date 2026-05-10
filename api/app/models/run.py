from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class Run(Base):
    __tablename__ = "runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategies.id"), nullable=False, index=True)
    dataset_id: Mapped[int] = mapped_column(ForeignKey("datasets.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(20), default="queued"
    )  # queued, running, completed, failed, timed_out
    started_at: Mapped[str | None] = mapped_column(String(32), nullable=True)
    completed_at: Mapped[str | None] = mapped_column(String(32), nullable=True)
    runtime_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    exit_code: Mapped[int | None] = mapped_column(Integer, nullable=True)

    strategy = relationship("Strategy", back_populates="runs")
    dataset = relationship("Dataset")
    logs = relationship("RunLog", back_populates="run")
    orders = relationship("Order", back_populates="run")
    positions = relationship("Position", back_populates="run")
    portfolio_snapshots = relationship("PortfolioSnapshot", back_populates="run")
    metrics = relationship("RunMetric", back_populates="run", uselist=False)