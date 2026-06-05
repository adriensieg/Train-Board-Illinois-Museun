"""Business logic for departures — keeps API routes thin."""
import uuid
from app.db.database import get_db
from app.models.departure import DepartureCreate, DepartureUpdate

def list_departures() -> list[dict]:
    return sorted(get_db().values(), key=lambda x: x["departure"])

def get_departure(rid: str) -> dict | None:
    return get_db().get(rid)

def create_departure(body: DepartureCreate) -> dict:
    db = get_db()
    rid = str(uuid.uuid4())
    record = {"id": rid, **body.model_dump()}
    db[rid] = record
    return record

def update_departure(rid: str, body: DepartureUpdate) -> dict | None:
    db = get_db()
    if rid not in db:
        return None
    for k, v in body.model_dump(exclude_none=True).items():
        db[rid][k] = v
    return db[rid]

def delete_departure(rid: str) -> bool:
    db = get_db()
    if rid not in db:
        return False
    del db[rid]
    return True
