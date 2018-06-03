package main

import (
	"net/http"
	"fmt"
	"os"
)

const (
	ENV_SELF_ADDR   = "SELF_ADDR"
	ENV_TARGET_ADDR = "TARGET_ADDR"

	DEFAULT_SELF_ADDR = "localhost:5000"
	DEFAULT_TARGET_ADDR = "http://localhost:8000"
)


func getAddr() (string, string) {
	var selfAddrStr = DEFAULT_SELF_ADDR
	if "" != os.Getenv(ENV_SELF_ADDR) {
		selfAddrStr = os.Getenv(ENV_SELF_ADDR)
	}

	var targetAddrStr = "http://" + DEFAULT_TARGET_ADDR
	if "" != os.Getenv(ENV_TARGET_ADDR) {
		targetAddrStr = "http://" + os.Getenv(ENV_TARGET_ADDR)
	}

	return selfAddrStr, targetAddrStr
}

func main() {
	var selfAddr, targetAddr = getAddr()

	var proxy = NewSimpleProxy(targetAddr)
	http.HandleFunc("/", proxy.handle)


	proxy.log.Info(fmt.Sprintf("starting proxy: %s -> %s", selfAddr, targetAddr))
	proxy.log.Error("proxy listener failed", "error",
		http.ListenAndServe(selfAddr,nil))
}
