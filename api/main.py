from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
from api.db.session import Session
from api.models import *
from sqlalchemy import select
from api.schemas import CourseResponse


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

app.mount("/static", StaticFiles(directory= BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory= BASE_DIR / "templates")


@app.get("/", response_model=list[CourseResponse])
def list_courses():
    with Session() as db:
        courses = db.scalars(select(Course)).all()
        return courses



@app.get("/editor")
def editor(request: Request):
    return templates.TemplateResponse(request=request, name="editor.html")

