from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
from .models import *
from sqlalchemy import select
from .routers import course


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

app.mount("/static", StaticFiles(directory= BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory= BASE_DIR / "templates")


app.include_router(course.router, prefix="/courses")


@app.get("/editor")
def editor(request: Request):
    return templates.TemplateResponse(request=request, name="editor.html")

