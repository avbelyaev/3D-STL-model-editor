# Proxy

Build & run:
```
docker build -t goproxy .
docker run -e SELF_PORT='5000' -e TARGET_PORT='8000' goproxy
```