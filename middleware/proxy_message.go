package main

type RequestMessage struct {
	Operation 	string `json:"operation"`
	Stl1 		string `json:"stl1"`
	Stl2 		string `json:"stl2"`
}

type ResponseMessage struct {
	Result 		string `json:"res"`
}


func NewRequestMessage(operation, stl1, stl2 string) *RequestMessage {
	return &RequestMessage{
		Operation: operation,
		Stl1:      stl1,
		Stl2:      stl2,
	}
}

func NewResponseMessage(result string) *ResponseMessage {
	return &ResponseMessage{
		Result: result,
	}
}