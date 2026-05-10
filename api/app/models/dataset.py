from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[int] = mapped_column(primary_key=True)
    version: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    start_date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    end_date: Mapped[str] = mapped_column(String(10), nullable=False)
    source_name: Mapped[str] = mapped_column(String(255), nullable=True)
    ingested_at: Mapped[str] = mapped_column(String(32), default="")
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, ready, failed
    description: Mapped[str] = mapped_column(Text, nullable=True)

    daily_bars = relationship("DailyBar", back_populates="dataset")