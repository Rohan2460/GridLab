from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

from sqlalchemy import select
from sqlalchemy.orm import Session

from api.models import Workspace, SubmissionStatus
from api.schemas.activity import ActivityResponse, WorkspaceResponse
from api.db.session import get_db
import docker
from docker.errors import DockerException
import socket
import asyncio
import json
import logging
from contextlib import suppress
from starlette.websockets import WebSocketState


DbSession = Annotated[Session, Depends(get_db)]

router = APIRouter()
docker_client = docker.from_env()


@router.get("", response_model=WorkspaceResponse)
def get_workspace(user: int, activity: int, db: DbSession):
    # TODO: implement auth, currently using hardcoded user id

    stmt = select(Workspace).where(Workspace.activity_id == activity, Workspace.user_id == 1)
    ws = db.scalar(stmt)
    if not ws:
        # Maybe dont store the path ?
        new_ws = Workspace(activity_id=activity, user_id=1, path="workspace/student_id/", status=SubmissionStatus.DRAFT)
        db.add(new_ws)

        try:
            db.commit()
            db.refresh(new_ws)
            return new_ws
        
        except Exception as e:
            print(e)
            db.rollback()
            raise HTTPException(409)

    return ws



@router.websocket("/{workspace_id}/terminal")
async def workspace_terminal(websocket: WebSocket, workspace_id: int, db: DbSession):

    workspace = db.get(Workspace, workspace_id)
    if not workspace:
        return HTTPException(404)

    # TODO: move container creation and start to non websocket endpoint
    # Also implement proper termination

    await websocket.accept()

    docker_sock = None
    exec_id = None
    tasks = []

    try:
        container = await asyncio.to_thread(
            docker_client.containers.run,
            "sandbox-gcc:latest",
            auto_remove=True,
            stdin_open=True,
            tty=True,
            command=["/bin/bash"]
        )

        await asyncio.to_thread(container.reload)

        if not container.attrs["State"]["Running"]:
            await websocket.send_bytes(
                b"\r\nContainer is not running.\r\n"
            )
            return

        exec_info = await asyncio.to_thread(
            docker_client.api.exec_create,
            container.id,
            cmd=["/bin/bash"],
            stdin=True,
            stdout=True,
            stderr=True,
            tty=True,
            user="1000:1000",
            workdir="/workspace"
        )
        exec_id = exec_info["Id"]

        docker_sock = await asyncio.to_thread(
            docker_client.api.exec_start,
            exec_id,
            tty=True,
            socket=True
        )

        docker_sock.settimeout(1.0)

        await asyncio.to_thread(
            docker_client.api.exec_resize,
            exec_id,
            height=24,
            width=80,
        )

        async def docker_to_browser():
            """Forward container output to xterm.js."""

            while True:
                try:
                    data = await asyncio.to_thread(
                        docker_sock.recv,
                        4096,
                    )
                except socket.timeout:
                    continue

                if not data:
                    break

                # Send terminal output as a binary WebSocket frame.
                await websocket.send_bytes(data)

        async def browser_to_docker():
            """Forward keyboard input and terminal resize events."""

            while True:
                message = await websocket.receive_text()

                try:
                    event = json.loads(message)
                except json.JSONDecodeError:
                    continue

                if not isinstance(event, dict):
                    continue

                event_type = event.get("type")

                if event_type == "input":
                    data = event.get("data", "")

                    if isinstance(data, str) and data:
                        await asyncio.to_thread(
                            docker_sock.sendall,
                            data.encode("utf-8"),
                        )

                elif event_type == "resize":
                    rows = event.get("rows")
                    cols = event.get("cols")

                    # Validate dimensions before passing them to Docker.
                    if type(rows) is not int or type(cols) is not int:
                        continue

                    rows = max(1, min(rows, 300))
                    cols = max(2, min(cols, 500))

                    await asyncio.to_thread(
                        docker_client.api.exec_resize,
                        exec_id,
                        height=rows,
                        width=cols,
                    )

        # Run both directions simultaneously.
        tasks = [
            asyncio.create_task(docker_to_browser()),
            asyncio.create_task(browser_to_docker()),
        ]

        # End this session when either side disconnects or exits.
        _, pending = await asyncio.wait(
            tasks,
            return_when=asyncio.FIRST_COMPLETED,
        )

        for task in pending:
            task.cancel()

        await asyncio.gather(*tasks, return_exceptions=True)

    except WebSocketDisconnect:
        pass

    except (DockerException, OSError, RuntimeError):
        print("Docker terminal session failed")

        with suppress(Exception):
            await websocket.send_bytes(
                b"\r\n[Terminal session failed]\r\n"
            )

    finally:
        for task in tasks:
            if not task.done():
                task.cancel()

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        if docker_sock is not None:
            with suppress(OSError):
                docker_sock.close()

        if websocket.client_state == WebSocketState.CONNECTED:
            with suppress(RuntimeError):
                await websocket.close()
