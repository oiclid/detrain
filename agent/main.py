from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from command import single_execute, manage_command
import time
from itertools import chain
import uvicorn
import daemon

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[ "X-Experimental-Stream-Data"],  # this is needed for streaming data header to be read by the client
)

@app.post("/execute/")
async def execcute_training(request: Request):
    command =  await request.body()
    console_log = single_execute(command)
    return StreamingResponse(console_log, media_type='text/plain')

@app.post("/do/")
async def do_command(request: Request):
    command =  await request.body()
    result = manage_command(command)
    return result

@app.post("/download/")
async def download_file(request: Request):
    path = await request.body()
    path = path.decode("utf-8")
    splash_index = path.rindex("/")
    folder_path = path[0, splash_index]
    file_name = path[(splash_index + 1) : len(path)]
    result = FileResponse(path=folder_path, filename=file_name, media_type='application/octet-stream')
    return result

if __name__ == "__main__":
    with daemon.DaemonContext():
        uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")