from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class StrategyValidation(Base):
    __tablename__ = "strategy_validations"

    id: Mapped[int] = mapped_column(primary_key=True)
    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategies.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(default="pending")  # pending, passed, failed
    warnings_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    errors_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    validated_at: Mapped[str | None] = mapped_column(default=None)

    strategy = relationship("Strategy", back_populates="validations")