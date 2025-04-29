from fastapi import *
from model import*
from fastapi.responses import JSONResponse
from model import db_connector

router = APIRouter()


@router.get("api/weather")
def get_weather(request:Request):
	pass

@router.get("api/weather/county/{countyname}")
def get_weather_by_County(request:Request,countyname:str = Path(...)):
	pass

@router.get("api/radar")
def get_radar(request:Request):
	con = None
	cursor = None

	select_query = """
	SELECT radar_img_url FROM radar_data
	WHERE radar_time BETWEEN NOW() - INTERVAL 6 HOUR AND NOW();
	"""
	
	cursor.execute(select_query)
	result = cursor.fetchall()
	
	return JSONResponse({"ok": True, "radars": result})
