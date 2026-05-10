from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    entrypoint: Mapped[str] = mapped_column(String(255), default="run_strategy")
    status: Mapped[str] = mapped_column(String(20), default="draft")
    created_at: Mapped[str] = mapped_column(String(32), default="")

    user = relationship("User", back_populates="strategies")
    files = relationship("StrategyFile", back_populates="strategy")
    validations = relationship("StrategyValidation", back_populates="strategy")
    runs = relationship("Run", back_populates="strategy")