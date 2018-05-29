package main

import (
	"net/http"
	"fmt"
	"os"
)

const (
	ENV_SELF_PORT = "SELF_PORT"
	ENV_TARGET_PORT = "TARGET_PORT"
)


func getAddr() (string, string) {
	var selfAddrStr = "localhost:"
	if "" != os.Getenv(ENV_SELF_PORT) {
		selfAddrStr += os.Getenv(ENV_SELF_PORT)

	} else {
		selfAddrStr += "5000"
	}

	var targetAddrStr = "http://localhost:"
	if "" != os.Getenv(ENV_TARGET_PORT) {
		targetAddrStr += os.Getenv(ENV_TARGET_PORT)

	} else {
		targetAddrStr += "8000"
	}

	return selfAddrStr, targetAddrStr
}

func main() {
	var selfAddr, targetAddr = getAddr()

	var proxy = NewCachingProxy(selfAddr, targetAddr)
	http.HandleFunc("/", proxy.handle)

	proxy.log.Info(fmt.Sprintf("starting proxy: %s -> %s", selfAddr, targetAddr))
	proxy.log.Error("proxy listener failed", "error",
		http.ListenAndServe(selfAddr, nil))
}
