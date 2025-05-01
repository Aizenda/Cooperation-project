from fastapi import *
from backend.model.db_connector import mysql_pool
from fastapi.responses import JSONResponse
from backend.model.api_response_handler import get_weather_by_location, get_weather_by_city
from datetime import datetime, timedelta
import os
import requests


router = APIRouter(prefix="/api")
WEATHER_API_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001"
API_KEY = os.getenv("WEATHER_API_KEY")
cache = {}


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
def get_radar(request: Request, hours: int = Query(6, description="要查詢的時間範圍（小時）", ge=1, le=48)):
    cache_key = f"radar_{hours}"  # 設定根據時間範圍的唯一快取鍵

    # 檢查是否有快取資料
    if cache_key in cache:
        cached_data = cache[cache_key]
        # 檢查快取資料是否過期
        # 設置過期時間為10分鐘
        if datetime.now() - cached_data["timestamp"] < timedelta(minutes=10):
            return JSONResponse(content=cached_data["data"], status_code=200)
        else:
            # 快取過期，清除快取
            del cache[cache_key]

    con = None
    cursor = None

    try:
        con = mysql_pool.get_connection()

        # 檢查連接是否有效
        if not con.is_connected():
            con.reconnect(attempts=3, delay=0.5)

        cursor = con.cursor(dictionary=True)

        # 使用傳入的時間範圍參數
        select_query = """
        SELECT radar_time, radar_img_url FROM radar_data
        WHERE radar_time BETWEEN NOW() - INTERVAL %s HOUR AND NOW()
        ORDER BY radar_time ASC;
        """

        cursor.execute(select_query, (hours,))
        result = cursor.fetchall()

        # 轉換 datetime 物件為字串
        for row in result:
            if isinstance(row['radar_time'], datetime):
                row['radar_time'] = row['radar_time'].strftime(
                    '%Y-%m-%d %H:%M:%S')

        # 將資料和快取時間儲存到快取
        cache[cache_key] = {
            "data": {
                "ok": True,
                "radars": result,
                "timeRange": hours,
                "count": len(result)
            },
            "timestamp": datetime.now()  # 標記快取的時間
        }

        return JSONResponse(content=cache[cache_key]["data"], status_code=200)

    except Exception as e:
        print(f"[錯誤] radar 查詢失敗: {e}")
        return JSONResponse(
            status_code=500,
            content={"ok": False, "message": "伺服器內部錯誤"}
        )

    finally:
        # 安全地關閉資源
        try:
            if cursor:
                cursor.close()
        except Exception as cursor_err:
            print(f"[錯誤] 關閉游標失敗: {cursor_err}")

        try:
            if con and con.is_connected():
                con.close()
        except Exception as con_err:
            print(f"[錯誤] 關閉連接失敗: {con_err}")
