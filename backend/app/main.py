from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.root_router import make_root_router
from contextlib import asynccontextmanager, AbstractAsyncContextManager
from collections.abc import AsyncIterator, Callable
from setup import logger, setup_logging

from services.admin_service import create_superadmin_if_not_exists

def make_lifespan() -> Callable[[FastAPI], AbstractAsyncContextManager[None]]:
    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        logger.info("Application started")
        await create_superadmin_if_not_exists()
        logger.info("Superadmin check completed")
        yield
        logger.info("Application stopped")
    
    return lifespan

def make_app() -> FastAPI:
    
    setup_logging(level="INFO")
    
    app = FastAPI(
        debug=True,
        title="Samurais API",
        description="API for Samurais website",
        version="1.0.0",
        lifespan=make_lifespan(),
    )
    
    # Add CORS middleware
    app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
    app.mount("/media", StaticFiles(directory="media"), name="media")
    app.include_router(make_root_router())

    return app


if __name__ == "__main__":
    """See clck.ru/3RUG2j if debug in PyCharm is broken"""
    import uvicorn

    uvicorn.run(app=make_app())