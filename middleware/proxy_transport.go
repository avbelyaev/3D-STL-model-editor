package main

import (
	"net/http"
	"io/ioutil"
	"bytes"
)

type ProxyTransport struct {
	// empty
}

func (t *ProxyTransport) RoundTrip(request *http.Request) (*http.Response, error)  {
	if "post" == request.Method {
		var buf, _= ioutil.ReadAll(request.Body)
		var rqBody= ioutil.NopCloser(bytes.NewBuffer(buf))
		println("Rq body: ", rqBody)
	}

	var response, err = http.DefaultTransport.RoundTrip(request)

	return response, err
}