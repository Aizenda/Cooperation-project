from fastapi import FastAPI
from fastapi import *
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.router import weather, bot
import requests
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開發階段先開放全部來源，部署時請鎖定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(weather.router)
app.include_router(bot.router)


@app.exception_handler(HTTPException)
def http_validation_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(content={"error": True, "message": exc.detail}, status_code=exc.status_code)


@app.get("/")
def index():
    file_path = "./static/html/index.html"
    return FileResponse(file_path, media_type="text/html")


@app.get("/weater")
def weater():
    file_path = "./static/html/weather.html"
    return FileResponse(file_path, media_type="text/html")


@app.get("/radar")
def radar():
    file_path = "./static/html/radar.html"
    return FileResponse(file_path, media_type="text/html")

# @app.get("/api/weather")
# def get_weather():
#     url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091"
#     params = {
#         "Authorization": "CWA-EAB2D458-7E8A-4F54-A0B0-204256EE4BD2",
#         "LocationName": "臺北市",
#         "format": "JSON",
#         "limit":10
#     }
#     try:
#         res = requests.get(url, params=params)
#         res.raise_for_status()
#         return JSONResponse(content=res.json())
#     except requests.RequestException as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/notify")
def notify():
    file_path = "./static/html/notify.html"
    return FileResponse(file_path, media_type="text/html")
