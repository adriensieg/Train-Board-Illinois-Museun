from pydantic import BaseModel
from typing import Optional

class Departure(BaseModel):
    id: str
    thumbnail: str
    description: str
    platform: str
    departure: str          # stored as HH:MM 24h

class DepartureCreate(BaseModel):
    thumbnail: str = "🚆"
    description: str
    platform: str = ""
    departure: str

class DepartureUpdate(BaseModel):
    thumbnail: Optional[str] = None
    description: Optional[str] = None
    platform: Optional[str] = None
    departure: Optional[str] = None
