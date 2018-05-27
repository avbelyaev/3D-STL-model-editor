package main

import (
	"net/http/httputil"
	"net/url"
	"github.com/mgutz/logxi/v1"
	"net/http"
)

type CachingProxy struct {
	target *url.URL
	proxy  *httputil.ReverseProxy
	log    log.Logger
}

func NewCachingProxy(listen, target string) *CachingProxy {
	var targetUrl, _ = url.Parse(target)
	return &CachingProxy{
		target: targetUrl,
		proxy:  httputil.NewSingleHostReverseProxy(targetUrl),
		log:    log.New("proxy"),
	}
}

func (p *CachingProxy) doSmth()  {
	p.log.Info("Doing smth")
}

func (p *CachingProxy) handle(rsp http.ResponseWriter, rq *http.Request) {
	p.log.Info("proxying request")

	rsp.Header().Set("X-GoProxy", "GoProxy")
	p.proxy.Transport = &ProxyTransport{}
	p.proxy.ServeHTTP(rsp, rq)
}