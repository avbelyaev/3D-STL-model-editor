# Proxy (GoPro)

Go build and run:
```
export SELF_ADDR=localhost:5000
export TARGET_ADDR=localhost:8000

go run main.go proxy.go proxy_transport.go proxy_message.go

# or just run
./middleware.sh
```

Docker build & run:
```
docker build -t gopro .
docker run -e SELF_PORT='5000' -e TARGET_PORT='8000' gopro
```