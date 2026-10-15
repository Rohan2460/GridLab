from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
from sqlalchemy import select
from .models import *
from .routers import course, activity, workspace


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

app.mount("/static", StaticFiles(directory= BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory= BASE_DIR / "templates")


app.include_router(course.router, prefix="/courses", tags=["course"])
app.include_router(activity.router, prefix="/activities", tags=["activity"])
app.include_router(workspace.router, prefix="/workspaces", tags=["workspace"])

@app.get("/editor")
def editor(request: Request):
    return templates.TemplateResponse(request=request, name="editor.html")

