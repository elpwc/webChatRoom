"use strict";
class Chatroom {
	constructor(username = '', server = "ws://localhost", port = 3032) {
		this.currentUsername = username;
		this.server = server;
		this.port = port;
	}
	server = "ws://localhost";
	port = 3032;
	currentUsername = "";
	ws;

	init = (onRecv, onClose, server = this.server, port = this.port) => {
		this.ws = new WebSocket(server + ":" + port);
		this.ws.onopen = (e) => {
			console.log("ws start");
			this.ws.send(
				JSON.stringify({
					type: "hello",
					data: {
						name: document.querySelector("#input2").value,
					},
				})
			);
		};

		this.ws.onmessage = (e) => {
            console.log('rcv: ', e.data);
			onRecv?.(JSON.parse(e.data));
		};

		this.ws.onclose = (e) => {
			console.log("ws close");
            onClose?.();
		};

		this.ws.onerror = (e) => {
        };
	};

	setUsername = (username) => {
		this.currentUsername = username;
	};

	send = (text) => {
		this.ws.send(text);
	};

	sendMsg = (text) => {
		this.ws.send(
			JSON.stringify({
				type: "msg",
				data: {
					text: text,
					name: this.currentUsername,
					date: new Date().toLocaleString(),
				},
			})
		);
	};
}

//module.exports = Chatroom;
