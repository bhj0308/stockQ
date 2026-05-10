import dramatiq
from redis.asyncio import Redis as AsyncRedis
from redis import Redis as SyncRedis

from api.app.config import settings

async_redis = AsyncRedis.from_url(settings.redis_url, decode_responses=True)
sync_redis = SyncRedis.from_url(settings.redis_url, decode_responses=True)

dramatiq.set_broker(dramatiq.brokers.redis.RedisBroker(url=settings.redis_url))


async def get_async_redis() -> AsyncRedis:
    return async_redis
