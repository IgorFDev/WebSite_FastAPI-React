from core.config import superadmin_settings
from db.session import AsyncSessionLocal
from models.models import Admin
from core.security import get_password_hash
from sqlalchemy import select
from setup import logger

async def create_superadmin_if_not_exists():
    async with AsyncSessionLocal() as db:
        admin = await db.execute(select(Admin).where(Admin.email == superadmin_settings.SUPERADMIN_EMAIL))
        admin = admin.scalar()
        if not admin:
            admin = Admin(
                email=superadmin_settings.SUPERADMIN_EMAIL,
                password_hash=get_password_hash(superadmin_settings.SUPERADMIN_PASSWORD),
                role="SUPERADMIN",
                first_name=superadmin_settings.SUPERADMIN_FIRST_NAME,
                last_name=superadmin_settings.SUPERADMIN_LAST_NAME
            )
            logger.info("Superadmin created from environment settings")
            db.add(admin)
            await db.commit()
            await db.refresh(admin)
        else:
            logger.info("Superadmin already exists")
        return admin
