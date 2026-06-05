from fastapi import APIRouter, HTTPException
from app.models.departure import DepartureCreate, DepartureUpdate
from app.services import departure_service

router = APIRouter(prefix="/api/departures", tags=["departures"])

@router.get("")
def list_deps():
    return departure_service.list_departures()

@router.post("", status_code=201)
def create_dep(body: DepartureCreate):
    return departure_service.create_departure(body)

@router.put("/{rid}")
def update_dep(rid: str, body: DepartureUpdate):
    record = departure_service.update_departure(rid, body)
    if not record:
        raise HTTPException(404, "Departure not found")
    return record

@router.delete("/{rid}", status_code=204)
def delete_dep(rid: str):
    if not departure_service.delete_departure(rid):
        raise HTTPException(404, "Departure not found")