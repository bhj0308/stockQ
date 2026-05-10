import dramatiq

from api.app.config import settings


@dramatiq.actor(queue_name=settings.dramatiq_queue_name, max_retries=0)
def run_strategy_job(run_id: int) -> None:
    """Dramatiq actor consumed by the worker to execute a strategy run.

    The worker picks this up, spins up a Docker container, and executes
    the strategy against the configured dataset.
    """
    pass


async def enqueue_run(run_id: int) -> None:
    """Push a run onto the Dramatiq queue."""
    run_strategy_job.send(run_id)