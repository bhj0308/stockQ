"""initial

Revision ID: b1fea12c1b5e
Revises:
Create Date: 2026-05-10 13:29:16.125934
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1fea12c1b5e"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("plan_tier", sa.String(50), nullable=False, server_default="free"),
        sa.Column("created_at", sa.String(32), nullable=False, server_default=""),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_table(
        "symbols",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ticker", sa.String(20), nullable=False),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("exchange", sa.String(100), nullable=True),
        sa.Column("sector", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("ticker"),
    )
    op.create_index("ix_symbols_ticker", "symbols", ["ticker"])
    op.create_table(
        "datasets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("version", sa.String(50), nullable=False),
        sa.Column("start_date", sa.String(10), nullable=False),
        sa.Column("end_date", sa.String(10), nullable=False),
        sa.Column("source_name", sa.String(255), nullable=True),
        sa.Column("ingested_at", sa.String(32), nullable=False, server_default=""),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("version"),
    )
    op.create_table(
        "strategies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("entrypoint", sa.String(255), nullable=False, server_default="run_strategy"),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
        sa.Column("created_at", sa.String(32), nullable=False, server_default=""),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_strategies_user_id", "strategies", ["user_id"])
    op.create_table(
        "strategy_files",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("strategy_id", sa.Integer(), nullable=False),
        sa.Column("storage_path", sa.String(500), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("file_type", sa.String(20), nullable=False),
        sa.Column("checksum", sa.String(64), nullable=True),
        sa.Column("uploaded_at", sa.String(32), nullable=False, server_default=""),
        sa.ForeignKeyConstraint(["strategy_id"], ["strategies.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_strategy_files_strategy_id", "strategy_files", ["strategy_id"])
    op.create_table(
        "strategy_validations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("strategy_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("warnings_json", sa.Text(), nullable=True),
        sa.Column("errors_json", sa.Text(), nullable=True),
        sa.Column("validated_at", sa.String(32), nullable=True),
        sa.ForeignKeyConstraint(["strategy_id"], ["strategies.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_strategy_validations_strategy_id", "strategy_validations", ["strategy_id"]
    )
    op.create_table(
        "runs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("strategy_id", sa.Integer(), nullable=False),
        sa.Column("dataset_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="queued"),
        sa.Column("started_at", sa.String(32), nullable=True),
        sa.Column("completed_at", sa.String(32), nullable=True),
        sa.Column("runtime_ms", sa.Integer(), nullable=True),
        sa.Column("exit_code", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["strategy_id"], ["strategies.id"],),
        sa.ForeignKeyConstraint(["dataset_id"], ["datasets.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_runs_strategy_id", "runs", ["strategy_id"])
    op.create_index("ix_runs_dataset_id", "runs", ["dataset_id"])
    op.create_table(
        "daily_bars",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("dataset_id", sa.Integer(), nullable=False),
        sa.Column("symbol_id", sa.Integer(), nullable=False),
        sa.Column("trade_date", sa.String(10), nullable=False),
        sa.Column("open", sa.Float(), nullable=False),
        sa.Column("high", sa.Float(), nullable=False),
        sa.Column("low", sa.Float(), nullable=False),
        sa.Column("close", sa.Float(), nullable=False),
        sa.Column("adjusted_close", sa.Float(), nullable=True),
        sa.Column("volume", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["dataset_id"], ["datasets.id"],),
        sa.ForeignKeyConstraint(["symbol_id"], ["symbols.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_daily_bars_dataset_id", "daily_bars", ["dataset_id"])
    op.create_index("ix_daily_bars_symbol_id", "daily_bars", ["symbol_id"])
    op.create_table(
        "run_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("stream", sa.String(20), nullable=False, server_default="stdout"),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.String(32), nullable=False, server_default=""),
        sa.ForeignKeyConstraint(["run_id"], ["runs.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_run_logs_run_id", "run_logs", ["run_id"])
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("symbol_id", sa.Integer(), nullable=False),
        sa.Column("trade_date", sa.String(10), nullable=False),
        sa.Column("side", sa.String(10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("reason", sa.String(255), nullable=True),
        sa.ForeignKeyConstraint(["run_id"], ["runs.id"],),
        sa.ForeignKeyConstraint(["symbol_id"], ["symbols.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_orders_run_id", "orders", ["run_id"])
    op.create_table(
        "positions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("symbol_id", sa.Integer(), nullable=False),
        sa.Column("trade_date", sa.String(10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("market_value", sa.Float(), nullable=False),
        sa.Column("weight", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["run_id"], ["runs.id"],),
        sa.ForeignKeyConstraint(["symbol_id"], ["symbols.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_positions_run_id", "positions", ["run_id"])
    op.create_table(
        "portfolio_snapshots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("trade_date", sa.String(10), nullable=False),
        sa.Column("cash", sa.Float(), nullable=False),
        sa.Column("gross_exposure", sa.Float(), nullable=False),
        sa.Column("net_liquidation_value", sa.Float(), nullable=False),
        sa.Column("drawdown", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["run_id"], ["runs.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_portfolio_snapshots_run_id", "portfolio_snapshots", ["run_id"])
    op.create_table(
        "run_metrics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("total_return", sa.Float(), nullable=True),
        sa.Column("annualized_return", sa.Float(), nullable=True),
        sa.Column("volatility", sa.Float(), nullable=True),
        sa.Column("max_drawdown", sa.Float(), nullable=True),
        sa.Column("sharpe_like", sa.Float(), nullable=True),
        sa.Column("win_rate", sa.Float(), nullable=True),
        sa.Column("turnover", sa.Float(), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["run_id"], ["runs.id"],),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("run_id"),
    )


def downgrade() -> None:
    op.drop_table("run_metrics")
    op.drop_table("portfolio_snapshots")
    op.drop_table("positions")
    op.drop_table("orders")
    op.drop_table("run_logs")
    op.drop_table("daily_bars")
    op.drop_table("runs")
    op.drop_table("strategy_validations")
    op.drop_table("strategy_files")
    op.drop_table("strategies")
    op.drop_table("datasets")
    op.drop_table("symbols")
    op.drop_table("users")