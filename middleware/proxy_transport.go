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
	"golang.org/x/crypto/openpgp/errors"
)

const (
	HEADER_REQUEST_MODIFIED  = "X-Request-Modified"
	HEADER_RESPONSE_MODIFIED = "X-Response-Modified"
	PATH_PERFORM             = "perform"
	HEADER_TEST				 = "X-test"
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
	var modifyErr error
	if strings.Contains(request.RequestURI, PATH_PERFORM) {
		if "POST" == request.Method {
			t.log.Info("\n--> Modifying request!")
			modifyErr = t.modifyRequest(request)
		}
	}

	// acquire response
	var response, roundTripErr = http.DefaultTransport.RoundTrip(request)

	if strings.Contains(request.RequestURI, PATH_PERFORM) || "" != request.Header.Get(HEADER_TEST) {
		response.Header.Set(HEADER_RESPONSE_MODIFIED, "0")

		t.log.Info("\n<-- Modifying response!")
		modifyErr = t.modifyResponse(response)
		if nil != modifyErr {
			t.log.Error("replying with status 500 on error: " + modifyErr.Error())
			response.Status = "500"
		}

		response.Header.Set(HEADER_RESPONSE_MODIFIED, "1")
	}

	return response, roundTripErr
}

func (t *ProxyTransport) modifyRequest(request *http.Request) error {
	t.log.Debug("reading request body")
	var originalMessage, readRqBodyErr = readRequestBody(request)
	if nil != readRqBodyErr {
		return readRqBodyErr
	}

	t.log.Debug("decoding files from base64 and dumping to disk")
	var filepath1, decodeErr1 = decodeFileAndSaveToDisk(originalMessage.Stl1)
	if nil != decodeErr1 {
		return decodeErr1
	}
	var filepath2, decodeErr2 = decodeFileAndSaveToDisk(originalMessage.Stl2)
	if nil != decodeErr2 {
		return decodeErr2
	}

	t.log.Debug("composing new message with filenames instead of files")
	var modifiedMsg = NewRequestMessage(originalMessage.Operation, filepath1, filepath2)
	var modMsgBytes, serializeErr = json.Marshal(modifiedMsg)
	check(serializeErr)

	t.log.Debug("modifying outcoming request")
	modifyRequestBody(request, modMsgBytes)
	return nil
}

func (t *ProxyTransport) modifyResponse(response *http.Response) error {
	t.log.Debug("reading response body")
	var originalResponse, readResponseBodyErr = readResponseBody(response)
	if nil != readResponseBodyErr {
		return readResponseBodyErr
	}

	t.log.Debug("reading file: " + originalResponse.Result)
	var fileContent, readErr = ioutil.ReadFile(originalResponse.Result)
	if nil != readErr {
		return errors.InvalidArgumentError("could not read file: " + originalResponse.Result)
	}
	println("read bytes of response: ", len(fileContent))

	t.log.Debug("encoding into base64 and composing new message")
	var encodedBase64Response = base64.StdEncoding.EncodeToString(fileContent)

	var modifiedResponse = NewResponseMessage(encodedBase64Response)
	var serialized, serializeErr = json.Marshal(modifiedResponse)
	if nil != serializeErr {
		return errors.InvalidArgumentError("response cannot be serialized after modification")
	}

	t.log.Debug("modifying outcoming response")
	modifyResponseBody(response, []byte(serialized))
	return nil
}

// dumps file to disk and returns filepath
func decodeFileAndSaveToDisk(fileContentBase64 string) (string, error) {
	var filename = "/tmp/stl-" + uuid.Must(uuid.NewV4()).String() + ".stl"
	var decoded, decodeErr = base64.StdEncoding.DecodeString(fileContentBase64)
	if nil != decodeErr {
		return "", errors.InvalidArgumentError("could not convert from base64")
	}

	var writeFileErr = ioutil.WriteFile(filename, decoded, 0644)
	if nil != writeFileErr {
		return "", errors.InvalidArgumentError("could not write file")
	}

	return filename, nil
}

// deserializes request body into type RequestMessage
func readRequestBody(request *http.Request) (*RequestMessage, error) {
	var buf, readErr = ioutil.ReadAll(request.Body)
	if nil != readErr {
		return nil, errors.InvalidArgumentError("request body cannot be read")
	}

	var bodyStr = string(buf)
	println("-> Rq body: ", bodyStr[:50])

	var message RequestMessage
	var deserializeErr = json.Unmarshal(buf, &message)
	if nil != deserializeErr {
		return nil, errors.InvalidArgumentError("request cannot be deserialized")
	}

	return &message, nil
}

func readResponseBody(response *http.Response) (*ResponseMessage, error) {
	var buf, readErr = ioutil.ReadAll(response.Body)
	if nil != readErr {
		return nil, errors.InvalidArgumentError("response body cannot be read")
	}

	var bodyStr = string(buf)
	println("<- Rsp body: ", bodyStr)

	var message ResponseMessage
	var deserializeErr = json.Unmarshal(buf, &message)
	if nil != deserializeErr {
		return nil, errors.InvalidArgumentError("response could not be deserialized")
	}

	return &message, nil
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
		log.Fatal("ERROR:", e)
	}
}
