var http = require('http'),
    httpProxy = require('http-proxy'),
	port = 5050,
	delay = 2000;

//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();

//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
http.createServer(function (req, res) {
  // This simulates an operation that takes 500ms to execute
  setTimeout(function () {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  }, delay);
}).listen(5050, function(){
	console.log('Direct: http://0.0.0.0:8080 / With '+delay+'ms of delay: http://0.0.0.0:5050');
});