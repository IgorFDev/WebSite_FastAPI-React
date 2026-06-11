from fastapi import HTTPException
from starlette import status
from models.models import AdminRole
from typing import Annotated
from fastapi import Depends
from models import Admin
from .dependencies import get_current_admin

def require_role(*allowed_roles: AdminRole):
    async def role_checker(
        current_admin: Admin = Depends(get_current_admin)
    ) -> callable:
        if current_admin.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав"
            )
        return current_admin
    return role_checker

SuperAdminDep = Annotated[
    Admin,
    Depends(require_role(AdminRole.SUPERADMIN))
]


AdminDep = Annotated[
    Admin,
    Depends(require_role(AdminRole.SUPERADMIN, AdminRole.ADMIN))
]

EditorDep = Annotated[
    Admin,
    Depends(require_role(AdminRole.SUPERADMIN, AdminRole.ADMIN, AdminRole.EDITOR))
]