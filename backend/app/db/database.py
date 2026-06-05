"""
In-memory departure store.
Replace with SQLAlchemy + a real DB when persistence is needed.
"""
import uuid

_db: dict[str, dict] = {}

def get_db() -> dict[str, dict]:
    return _db

def _seed() -> None:
    rows = [
        {"thumbnail": "🚄", "description": "TGV Duplex - Paris Gare de Lyon",        "platform": "4A",           "departure": "06:32"},
        {"thumbnail": "🚂", "description": "Intercites 4661 - Bordeaux Saint-Jean",  "platform": "7",            "departure": "07:15"},
        {"thumbnail": "🚅", "description": "Eurostar 9084 - London St Pancras",      "platform": "Depot Street", "departure": "09:01"},
        {"thumbnail": "🚄", "description": "TGV Duplex - Paris Gare de Lyon",        "platform": "4A",           "departure": "11:45"},
        {"thumbnail": "🚆", "description": "TER Auvergne - Clermont-Ferrand",        "platform": "11",           "departure": "13:22"},
        {"thumbnail": "🚂", "description": "Intercites 4661 - Bordeaux Saint-Jean",  "platform": "7",            "departure": "15:30"},
        {"thumbnail": "🚅", "description": "Eurostar 9084 - London St Pancras",      "platform": "Depot Street", "departure": "17:05"},
    ]
    for r in rows:
        rid = str(uuid.uuid4())
        _db[rid] = {"id": rid, **r}

_seed()
