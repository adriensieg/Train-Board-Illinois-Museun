"""TOTP + session token helpers. Zero network calls — purely local."""
import io, base64, os, secrets
import pyotp, qrcode
from app.core.config import settings

# ── TOTP secret (persisted across restarts) ───────────────────────────────────
def _load_or_create_secret() -> str:
    path = settings.totp_secret_file
    if os.path.exists(path):
        with open(path) as f:
            return f.read().strip()
    secret = pyotp.random_base32()
    with open(path, "w") as f:
        f.write(secret)
    os.chmod(path, 0o600)
    return secret

TOTP_SECRET: str = _load_or_create_secret()
_totp = pyotp.TOTP(TOTP_SECRET)

# ── Session store  { token: username } ───────────────────────────────────────
_sessions: dict[str, str] = {}

def generate_qr_b64() -> str:
    uri = _totp.provisioning_uri(
        name=settings.totp_account,
        issuer_name=settings.totp_issuer,
    )
    img = qrcode.make(uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()

def verify_otp(code: str) -> bool:
    return _totp.verify(code, valid_window=1)

def create_session(username: str) -> str:
    token = secrets.token_urlsafe(32)
    _sessions[token] = username
    return token

def get_session_user(token: str | None) -> str | None:
    return _sessions.get(token) if token else None

def destroy_session(token: str | None) -> None:
    if token and token in _sessions:
        del _sessions[token]
