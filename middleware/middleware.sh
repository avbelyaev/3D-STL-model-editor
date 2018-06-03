#!/usr/bin/env bash

export LOGXI=*
export LOGXI_FORMAT=pretty,happy

export SELF_ADDR=localhost:5000
export TARGET_ADDR=localhost:8000

go run main.go proxy.go proxy_transport.go proxy_message.go
