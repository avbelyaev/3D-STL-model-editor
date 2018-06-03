package main

import (
	"net/http/httputil"
	"net/url"
	"github.com/mgutz/logxi/v1"
	"net/http"
)

type SimpleProxy struct {
	target *url.URL
	proxy  *httputil.ReverseProxy
	log    log.Logger
}

func NewSimpleProxy(target string) *SimpleProxy {
	var targetUrl, _ = url.Parse(target)
	return &SimpleProxy{
		target: targetUrl,
		proxy:  httputil.NewSingleHostReverseProxy(targetUrl),
		log:    log.New("proxy"),
	}
}

func (p *SimpleProxy) handle(rsp http.ResponseWriter, rq *http.Request) {
	p.log.Info("proxying request")

	rsp.Header().Set("X-proxy", "GoProxy")
	p.proxy.Transport = NewProxyTransport()
	p.proxy.ServeHTTP(rsp, rq)
}