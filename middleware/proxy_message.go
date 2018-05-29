package main

type ProxyMessage struct {
	Operation 	string `json:"operation"`
	Stl1 		string `json:"stl1"`
	Stl2 		string `json:"stl2"`
}

func NewProxyMessage(operation, stl1, stl2 string) *ProxyMessage {
	return &ProxyMessage{
		Operation: operation,
		Stl1:      stl1,
		Stl2:      stl2,
	}
}