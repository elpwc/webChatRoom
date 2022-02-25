"use strict";

const http = require("http");

const PORT = 3031;

const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Hello, world!");
});

server.listen(PORT, () => {
	console.log("server start");
});

const clients = [];

const websocket = require("nodejs-websocket");

const wsserver = websocket
	.createServer((conn) => {
		console.log("new connection");
		conn.on("connection", (code) => {
			console.log("start", code);
		});
		conn.on("text", (res) => {
			console.log("send: " + res);

			const recvData = JSON.parse(res);

			switch (recvData?.type) {
				case "hello":
					if (clients.includes(recvData?.data?.name)) {
						clients.push(recvData?.data?.name);
					}
					break;
				case "msg":
					wsserver.connections.forEach((connection) => {
						//console.log(connection);
						connection.sendText(res);
					});
					break;
				default:
					break;
			}

			//console.log(wsserver.connections);
			
		});
		conn.on("close", (code) => {
			console.log("close", code);
		});
		conn.on("error", (code) => {
			console.log("error", code);
		});
	})
	.listen(PORT + 1, () => {
		console.log("ws server start");
	});
