package main

import (
	"net/http"
	"io/ioutil"
	"bytes"
	"github.com/mgutz/logxi/v1"
	"strconv"
	"encoding/json"
	"github.com/satori/go.uuid"
)

type ProxyTransport struct {
	log    log.Logger
}

func NewProxyTransport() *ProxyTransport {
	return &ProxyTransport{
		log: log.New("transport"),
	}
}

func (t *ProxyTransport) RoundTrip(request *http.Request) (*http.Response, error)  {
	request.Header.Set("X-Modified", "0")

	if "POST" == request.Method {
		var originalMessage = readRequestBody(request)

		var filepath1 = saveFileToDisk(originalMessage.Stl1)
		var filepath2 = saveFileToDisk(originalMessage.Stl2)

		var modifiedMsg = NewProxyMessage(originalMessage.Operation, filepath1, filepath2)
		var modMsgBytes, serializeErr = json.Marshal(modifiedMsg)
		check(serializeErr)

		modifyRequestBody(request, modMsgBytes)

		request.Header.Set("X-Modified", "1")
	}

	var response, err = http.DefaultTransport.RoundTrip(request)

	return response, err
}

// dumps file to disk and returns filepath
func saveFileToDisk(encodedFile string) string {
	var filename = "/tmp/stl-" + uuid.Must(uuid.NewV4()).String() + ".stl"
	var fileBytes = []byte(encodedFile)
	var writeFileErr = ioutil.WriteFile(filename, fileBytes, 0644)
	check(writeFileErr)

	return filename
}

// deserializes request body into type ProxyMessage
func readRequestBody(request *http.Request) *ProxyMessage {
	var buf, readErr = ioutil.ReadAll(request.Body)
	check(readErr)

	var message ProxyMessage
	var deserializeErr = json.Unmarshal(buf, &message)
	check(deserializeErr)

	return &message
}

func modifyRequestBody(request *http.Request, newBody []byte) {
	request.Body = ioutil.NopCloser(bytes.NewReader(newBody))
	request.ContentLength = int64(len(newBody))
	request.Header.Set("Content-Length", strconv.Itoa(len(newBody)))
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}