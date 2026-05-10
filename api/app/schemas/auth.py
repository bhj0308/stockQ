from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: str
    display_name: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    display_name: str
    plan_tier: str
    created_at: str

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse