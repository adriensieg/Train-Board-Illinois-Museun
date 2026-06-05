from fastapi import APIRouter, Cookie, Response, HTTPException
from pydantic import BaseModel
from app.services import auth_service
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

class OTPRequest(BaseModel):
    code: str

class AuthStatus(BaseModel):
    authenticated: bool
    user: str | None = None

@router.get("/setup")
def setup():
    """Returns QR code (base64 PNG) and raw secret for first-time setup."""
    return auth_service.get_setup_data()

@router.post("/login")
def login(body: OTPRequest, response: Response):
    token = auth_service.login(body.code)
    if not token:
        raise HTTPException(401, "Invalid OTP code")
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=settings.session_ttl_seconds,
    )
    return {"ok": True}

@router.post("/logout")
def logout(response: Response, session_token: str | None = Cookie(default=None)):
    auth_service.logout(session_token)
    response.delete_cookie("session_token")
    return {"ok": True}

@router.get("/me", response_model=AuthStatus)
def me(session_token: str | None = Cookie(default=None)):
    user = auth_service.authenticate(session_token)
    return AuthStatus(authenticated=user is not None, user=user)