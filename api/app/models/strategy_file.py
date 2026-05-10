from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class StrategyFile(Base):
    __tablename__ = "strategy_files"

    id: Mapped[int] = mapped_column(primary_key=True)
    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategies.id"), nullable=False, index=True)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)  # .py, .zip
    checksum: Mapped[str] = mapped_column(String(64), nullable=True)
    uploaded_at: Mapped[str] = mapped_column(String(32), default="")

    strategy = relationship("Strategy", back_populates="files")