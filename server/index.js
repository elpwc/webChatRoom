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

const clients = []; // {connection: {}, name: '', status: 'on/leave'}

const websocket = require("nodejs-websocket");

const wsserver = websocket
	.createServer((conn) => {
		console.log("new connection");
		conn.on("connection", (code) => {
			console.log("start", code);
		});
		conn.on("text", (res) => {
			console.log("rcv: " + res);

			const recvData = JSON.parse(res);

			switch (recvData?.type) {
				case "hello":
					const name = recvData?.data?.name;
					const savedClient = clients.filter((client) => {
						return client.name === name;
					});
					//console.log(savedClient, savedClient.length);
					if (savedClient.length === 0) {
						clients.push({ name, connection: conn, status: "on" });
					} else {
						savedClient[0].connection = conn;
						savedClient[0].status = "on";
					}
					wsserver.connections.forEach((connection) => {
						connection.sendText(
							JSON.stringify({
								type: "change",
								data: {
									name: recvData?.data?.name,
									status: "enter",
								},
							})
						);

						connection.sendText(
							JSON.stringify({
								type: "userlist",
								data: {
									users: clients.map((client) => {
										return {
											name: client.name,
											status: client.status,
										};
									}),
								},
							})
						);
					});
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
			const leftClient = clients.filter((client) => {
				return client.connection.key === conn.key;
			})?.[0];
			if (leftClient.status) {
				leftClient.status = "leave";
			}

			wsserver.connections.forEach((connection) => {
				connection.sendText(
					JSON.stringify({
						type: "change",
						data: {
							name: leftClient?.name,
							status: "leave",
						},
					})
				);
				connection.sendText(
					JSON.stringify({
						type: "userlist",
						data: {
							users: clients.map((client) => {
								return {
									name: client.name,
									status: client.status,
								};
							}),
						},
					})
				);
			});

			console.log("close", code);
		});
		conn.on("error", (code) => {
			console.log("error", code);
		});
	})
	.listen(PORT + 1, () => {
		console.log("ws server start");
	});
