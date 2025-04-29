from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def index():
    file_path = "./static/index.html"
    return FileResponse(file_path, media_type="text/html")

@app.get("/weater")
def weater():
    file_path = "./static/weather.html"
    return FileResponse(file_path,media_type="text/html")