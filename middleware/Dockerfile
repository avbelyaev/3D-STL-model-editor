FROM golang:1.8

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...

ENV LOGXI=*
ENV LOGXI_FORMAT=pretty,happy

ENV SELF_PORT=5000
ENV TARGET_PORT=8000

EXPOSE 5000

ENTRYPOINT ["go", "run", "main.go", "proxy.go", "proxy_transport.go", "proxy_message.go"]