from fastapi import FastAPI
from fastapi import *
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.router import weather
app = FastAPI()

# app.mount("/static", StaticFiles(directory="/static"), name="static")
app.include_router(weather.router)


@app.exception_handler(HTTPException)
def http_validation_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(content={"error": True, "message": exc.detail}, status_code=exc.status_code)


@app.get("/")
def index():
    file_path = "./static/index.html"
    return FileResponse(file_path, media_type="text/html")


@app.get("/weather")
def weater():
    file_path = "./static/weather.html"
    return FileResponse(file_path, media_type="text/html")


@app.get("/{full_path:path}")
def page_not_found(full_path: str):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail="Page was not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
