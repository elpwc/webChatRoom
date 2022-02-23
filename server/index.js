const http = require("http");

const PORT = 3031;

const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Hello, world!");
});

server.listen(PORT, () => {
	console.log("server start");
});

const ws = require("nodejs-websocket");

const wsserver = ws.createServer((conn) => {
	conn.on("text", (res) => {
		console.log("send: " + res);
		console.log(wsserver.connections);
		wsserver.connections.forEach(connection => {
			conn.sendText(res);
		})
	});
	conn.on("connect", (code) => {
		console.log("start", code);
	});
	conn.on("close", (code) => {
		console.log("close", code);
	});
	conn.on("error", (code) => {
		console.log("error", code);
	});
});

wsserver.listen(PORT + 1, () => {
	console.log("ws server start");
});
