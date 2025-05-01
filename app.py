from fastapi import FastAPI
from fastapi import *
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.router import weather, bot
app = FastAPI()

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
