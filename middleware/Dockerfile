FROM golang:1.8

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...

ENV LOGXI=*
ENV LOGXI_FORMAT=pretty,happy


ENTRYPOINT ["go", "run", "main.go", "proxy.go", "proxy_transport.go", "proxy_message.go"]