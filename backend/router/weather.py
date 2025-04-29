from fastapi import *
from model import*
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("api/weather")
def get_weather(request:Request):
	pass

@router.get("api/weather/county/{countyname}")
def get_weather_by_County(request:Request,countyname:str = Path(...)):
	pass

@router.get("api/radar")
def get_radar(request:Request):
	pass