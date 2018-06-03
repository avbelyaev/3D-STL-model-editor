package main

import (
	"net/http"
	"io/ioutil"
	"bytes"
	"github.com/mgutz/logxi/v1"
	"strconv"
	"encoding/json"
	"github.com/satori/go.uuid"
	"encoding/base64"
	"strings"
)

const (
	HEADER_REQUEST_MODIFIED  = "X-Request-Modified"
	HEADER_RESPONSE_MODIFIED = "X-Response-Modified"
	PATH_PERFORM             = "perform"
)

type ProxyTransport struct {
	log log.Logger
}

func NewProxyTransport() *ProxyTransport {
	return &ProxyTransport{
		log: log.New("transport"),
	}
}

func (t *ProxyTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	if strings.Contains(request.RequestURI, PATH_PERFORM) {
		request.Header.Set(HEADER_REQUEST_MODIFIED, "0")
		if "POST" == request.Method {
		    t.log.Info("modifying request")

			modifyRequest(request)
		}
		request.Header.Set(HEADER_REQUEST_MODIFIED, "1")
	}

	// acquire response
	var response, roundTripErr = http.DefaultTransport.RoundTrip(request)

	if strings.Contains(request.RequestURI, PATH_PERFORM) {
		response.Header.Set(HEADER_RESPONSE_MODIFIED, "0")
		if "POST" == request.Method {
		    t.log.Info("modifying response")

			modifyResponse(response)
		}
		response.Header.Set(HEADER_RESPONSE_MODIFIED, "1")
	}

	return response, roundTripErr
}

func modifyRequest(request *http.Request) {
	var originalMessage = readRequestBody(request)

	var filepath1 = decodeFileAndSaveToDisk(originalMessage.Stl1)
	var filepath2 = decodeFileAndSaveToDisk(originalMessage.Stl2)

	var modifiedMsg = NewRequestMessage(originalMessage.Operation, filepath1, filepath2)
	var modMsgBytes, serializeErr = json.Marshal(modifiedMsg)
	check(serializeErr)

	modifyRequestBody(request, modMsgBytes)
}

func modifyResponse(response *http.Response) {
	var originalResponse = readResponseBody(response)

	var fileContent, readErr = ioutil.ReadFile(originalResponse.Result)
	check(readErr)

	var encodedBase64Response = base64.StdEncoding.EncodeToString(fileContent)

	var modifiedResponse = NewResponseMessage(encodedBase64Response)
	var serialized, serializeErr = json.Marshal(modifiedResponse)
	check(serializeErr)

	modifyResponseBody(response, []byte(serialized))
}

// dumps file to disk and returns filepath
func decodeFileAndSaveToDisk(fileContentBase64 string) string {
	var filename = "/tmp/stl-" + uuid.Must(uuid.NewV4()).String() + ".stl"
	var decoded, decodeErr = base64.StdEncoding.DecodeString(fileContentBase64)
	check(decodeErr)

	var writeFileErr = ioutil.WriteFile(filename, decoded, 0644)
	check(writeFileErr)

	return filename
}

// deserializes request body into type RequestMessage
func readRequestBody(request *http.Request) *RequestMessage {
	var buf, readErr = ioutil.ReadAll(request.Body)
	check(readErr)

	var bodyStr = string(buf)
	println("-> Rq body: ", bodyStr[:50])

	var message RequestMessage
	var deserializeErr = json.Unmarshal(buf, &message)
	check(deserializeErr)

	return &message
}

func readResponseBody(response *http.Response) *ResponseMessage {
	var buf, readErr = ioutil.ReadAll(response.Body)
	check(readErr)

	var bodyStr = string(buf)
	println("<- Rsp body: ", bodyStr)

	var message ResponseMessage
	var deserializeErr = json.Unmarshal(buf, &message)
	check(deserializeErr)

	return &message
}

func modifyRequestBody(request *http.Request, newBody []byte) {
	request.Body = ioutil.NopCloser(bytes.NewReader(newBody))
	request.ContentLength = int64(len(newBody))
	request.Header.Set("Content-Length", strconv.Itoa(len(newBody)))
}

// thanks golang has no polymorphism
func modifyResponseBody(response *http.Response, newBody []byte) {
	response.Body = ioutil.NopCloser(bytes.NewReader(newBody))
	response.ContentLength = int64(len(newBody))
	response.Header.Set("Content-Length", strconv.Itoa(len(newBody)))
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
