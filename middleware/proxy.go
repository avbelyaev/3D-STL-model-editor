package main

import (
	"net/http/httputil"
	"net/url"
	"github.com/mgutz/logxi/v1"
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

func (proxy *CachingProxy) doSmth()  {
	proxy.log.Info("Doing smth")
}