package main


func main() {

	// TODO get from ENV vars
	var proxy = NewCachingProxy("localhost:8000", "localhost:5000")
	println("hello proxy at ", proxy.target.Path)
	proxy.doSmth()
}
