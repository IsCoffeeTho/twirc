const EventEmitter = require("events");
const WSC = require("websocket").client;

/** provived by twitch */
const ircparser = require('./ircparser');

class IRCmsg {
	constructor(socket, msgRaw) {
		this.socket = socket;
		const _parsed = ircparser(msgRaw);
		this.raw = msgRaw;
		if (_parsed) {
			this.command = _parsed.command.command;
			if (_parsed.command.channel)
				this.channel = _parsed.command.channel;
			this.parameters = _parsed.parameters;
			this.tags = _parsed.tags;
			this.source = _parsed.source;
		}
	}
}

class IRCsocket extends EventEmitter {
	#c;

	constructor(connection) {
		super();
		this.#c = connection;
		this.#c.on('error', (err) => {
			this.emit("error", err);
		});
		this.#c.on('closed', (err) => {
			this.emit("error", err);
		});
		this.#c.on('message', (raw) => {
			if (raw.type !== 'utf8')
				return;
			let rawMsg = raw.utf8Data.trimEnd();
			let msgs = rawMsg.split(/\r\n/g);
			msgs.forEach((message) => {
				var msg = new IRCmsg(connection, message);
				if (msg.command)
					switch (msg.command) {
						case "PING": connection.sendUTF(`PONG ${msg.parameters}`); break;
						default: this.emit("message", msg); break;
					}
			});
		});
	}

	capReq(...capabilities) {
		this.#c.sendUTF(`CAP REQ :${capabilities.join(" ")}`);
	}

	authenticate(user, pass) {
		this.#c.sendUTF(`PASS ${pass}`);
		this.#c.sendUTF(`NICK ${user}`);
	}

	send(msg) {
		this.#c.sendUTF(msg);
	}
}

class _IRC extends EventEmitter {
	#WS;
	constructor(hostname) {
		super();
		if (typeof hostname != "string")
			throw new TypeError("hostname needs to be a string.");
		if (!hostname.startsWith("ws://"))
			throw new TypeError("hostname must be a websocket endpoint.");
		this.state = _IRC.SPAWNED;
		this.#WS = new WSC();
		this.#WS.on('connect', (c) => { this._connection(c) });
		this.#WS.connect(hostname);
	}

	_connection(c) {
		c.on('closed', (err) => {
			this.emit("close", err);
		});
		this.emit('open', new IRCsocket(c));
	}

	static SPAWNED = 0;
	static CONNECTED = 1;
	static READY = 2;
}

module.exports = _IRC;