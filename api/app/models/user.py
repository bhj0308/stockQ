from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    plan_tier: Mapped[str] = mapped_column(String(50), default="free")
    created_at: Mapped[str] = mapped_column(
        String(32), default=""
    )  # ISO-8601 set at app level

    strategies = relationship("Strategy", back_populates="user")