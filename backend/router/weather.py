from fastapi import *
from model import *
from fastapi.responses import JSONResponse
from backend.model.api_response_handler import get_weather_by_location, get_weather_by_city
router = APIRouter(prefix="/api")


@router.get("/weather/district")
def get_weather(city: str, district: str, target_element: str = Query("天氣預報綜合描述")):
    """
    query_string範例：http://127.0.0.1:8000/api/weather/district?city=臺北市&district=大安區&target_element=平均溫度,平均相對濕度
    """
    target_element_list = target_element.split(",")
    weather_data = get_weather_by_location(city, district, target_element_list)
    return JSONResponse(content=weather_data, status_code=200)


@router.get("/weather/city")
def get_weather_by_County(city: str,  target_element: str = Query("天氣預報綜合描述")):
    """
    query_string範例：http://127.0.0.1:8000/api/weather/city?city=臺北市&district=大安區&target_element=平均溫度,平均相對濕度
    """
    target_element_list = target_element.split(",")
    weather_data = get_weather_by_city(city, target_element_list)
    return JSONResponse(content=weather_data, status_code=200)


@router.get("/radar")
def get_radar(request: Request):
    con = None
    cursor = None

    select_query = """
    SELECT radar_img_url FROM radar_data
    WHERE radar_time BETWEEN NOW() - INTERVAL 6 HOUR AND NOW();
    """

    cursor.execute(select_query)
    result = cursor.fetchall()

    return JSONResponse({"ok": True, "radars": result})
