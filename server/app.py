from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
app = FastAPI()


@app.get("/")
def index():
    file_path = "../123.html"
    return FileResponse(file_path, media_type="text/html")
