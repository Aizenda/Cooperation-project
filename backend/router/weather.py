from fastapi import *
from backend.model.db_connector import mysql_pool
from fastapi.responses import JSONResponse
from backend.model.api_response_handler import get_weather_by_location, get_weather_by_city
from datetime import datetime
import os
import requests

router = APIRouter(prefix="/api")
WEATHER_API_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001"
API_KEY = os.getenv("WEATHER_API_KEY")

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

@router.get("/weather/all-cities")
def get_weather():
    try:
        params = {
            "Authorization": API_KEY,
            "format": "JSON"
        }
        res = requests.get(WEATHER_API_URL, params=params)
        res.raise_for_status()
        data = res.json()
        locations = data["records"]["location"]

        city_weather = {}

        for location in locations:
            city = location["locationName"]
            elements = {e["elementName"]: e["time"] for e in location["weatherElement"]}

            current = {
                "time": elements["Wx"][0]["startTime"],
                "Wx": elements["Wx"][0]["parameter"]["parameterName"],
                "PoP": elements["PoP"][0]["parameter"]["parameterName"],
                "MinT": elements["MinT"][0]["parameter"]["parameterName"],
                "CI": elements["CI"][0]["parameter"]["parameterName"],
                "MaxT": elements["MaxT"][0]["parameter"]["parameterName"],
            }

            forecast = []
            for i in range(1, len(elements["Wx"])):  # 從 index 1 開始取得之後幾段時間預報
                forecast.append({
                    "startTime": elements["Wx"][i]["startTime"],
                    "endTime": elements["Wx"][i]["endTime"],
                    "Wx": elements["Wx"][i]["parameter"]["parameterName"],
                    "PoP": elements["PoP"][i]["parameter"]["parameterName"],
                    "MinT": elements["MinT"][i]["parameter"]["parameterName"],
                    "CI": elements["CI"][i]["parameter"]["parameterName"],
                    "MaxT": elements["MaxT"][i]["parameter"]["parameterName"],
                })

            city_weather[city] = {
                "current": current,
                "forecast": forecast
            }

        return JSONResponse(content=city_weather, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"ok": False, "error": str(e)}, status_code=500)

@router.get("/radar")
def get_radar(request: Request):
    con = None
    cursor = None

    try:
        con = mysql_pool.get_connection() 
        cursor = con.cursor(dictionary=True)
        select_query = """
        SELECT radar_time,radar_img_url FROM radar_data
        WHERE radar_time BETWEEN NOW() - INTERVAL 6 HOUR AND NOW();
        """

        cursor.execute(select_query)
        result = cursor.fetchall()

        # 轉換 datetime 物件為字串
        for row in result:
            if isinstance(row['radar_time'], datetime):
                row['radar_time'] = row['radar_time'].strftime('%Y-%m-%d %H:%M:%S')

        return JSONResponse({"ok": True, "radars": result})

    except Exception as e:
        print(f"[錯誤] radar 查詢失敗: {e}")
        return JSONResponse(status_code=500, content={"ok": False, "message": "伺服器內部錯誤"})

    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()

    
