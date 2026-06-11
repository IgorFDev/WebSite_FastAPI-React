from pydantic import BaseModel, EmailStr
from datetime import datetime
from models.models import AdminRole

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str | None = None
    role: AdminRole

class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str | None = None
    role: AdminRole
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
