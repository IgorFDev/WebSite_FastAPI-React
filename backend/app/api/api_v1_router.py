from fastapi import APIRouter

def make_v1_router() -> APIRouter:
    router = APIRouter(prefix="/api/v1")
    
    @router.get("/")
    async def info() -> dict:
        return {
            "INFO": "Samurais web-site"
        }
    
    return router