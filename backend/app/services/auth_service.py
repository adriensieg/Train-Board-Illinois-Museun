"""Auth business logic — thin wrapper over security primitives."""
from app.core.security import (
    generate_qr_b64, verify_otp, create_session,
    get_session_user, destroy_session, TOTP_SECRET,
)

def get_setup_data() -> dict:
    return {"qr_b64": generate_qr_b64(), "secret": TOTP_SECRET}

def login(code: str) -> str | None:
    """Returns session token on success, None on failure."""
    if verify_otp(code):
        return create_session("admin")
    return None

def logout(token: str | None) -> None:
    destroy_session(token)

def authenticate(token: str | None) -> str | None:
    """Returns username if token is valid, else None."""
    return get_session_user(token)
