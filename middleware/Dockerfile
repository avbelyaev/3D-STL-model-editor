FROM golang:1.10

COPY . /go/src/app

WORKDIR /go/src/app

# '...' tells golang to go down recursively
RUN go get -d ./...

ENV LOGXI=*
ENV LOGXI_FORMAT=pretty,happy


ENTRYPOINT ["go", "run", "main.go", "proxy.go", "proxy_transport.go", "proxy_message.go"]