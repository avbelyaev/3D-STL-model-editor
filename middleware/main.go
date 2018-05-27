package main

import (
	"net/http"
	"fmt"
)

func main() {

	// TODO get from ENV vars
	var proxyAddrStr = "localhost:5000"
	var targetAddrStr = "http://localhost:8000"

	var proxy = NewCachingProxy(proxyAddrStr, targetAddrStr)

	http.HandleFunc("/", proxy.handle)
	proxy.log.Info(fmt.Sprintf("starting proxy: %s -> %s", proxyAddrStr, targetAddrStr))
	proxy.log.Error("proxy listener failed", "error",
		http.ListenAndServe(proxyAddrStr, nil))
}
