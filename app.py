from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def index():
    file_path = "./static/html/index.html"
    return FileResponse(file_path, media_type="text/html")

@app.get("/weater")
def weater():
    file_path = "./static/html/weather.html"
    return FileResponse(file_path,media_type="text/html")

@app.get("/radar")
def radar():
    file_path = "./static/html/radar.html"
    return FileResponse(file_path,media_type="text/html")