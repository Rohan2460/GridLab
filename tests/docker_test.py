import docker 

client = docker.from_env()
cont = client.containers.run(
    "sandbox-gcc:latest",
    tty=True,
    stdin_open=True,
    stdout=True,
    detach=False,
    command=["/bin/bash"],
    auto_remove=True
)