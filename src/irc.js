const EventEmitter = require("events");
const WSC = require("websocket").client;

class IRCsocket extends EventEmitter
{
	#c;

	constructor(connection)
	{
		super();
		this.#c = connection;
		this.#c.on('error', (err) => {
			this.emit("error", err);
		});
		this.#c.on('closed', (err) => {
			this.emit("error", err);
		});
	}

	capReq(...capabilities)
	{
		this.#c.sendUTF(`CAP REQ :${capabilities.join(" ")}`);
	}

	authenticate(user, pass)
	{
		this.#c.sendUTF(`PASS ${pass}`);
		this.#c.sendUTF(`NICK ${user}`);
	}
}

class _IRC extends EventEmitter
{
	constructor(hostname)
	{
		super();
		if (typeof hostname != "string")
			throw new TypeError("hostname needs to be a string.");
		if (!hostname.startsWith("ws://"))
			throw new TypeError("hostname must be a websocket endpoint.");
		this.#WS = new WSC();
		this.#WS.on('connect', (c) => {this._connection(c)});
		this.#WS.connect(hostname);
	}

	_connection(c)
	{
		c.on('error', (err) => {

		});
	}
}

module.exports = _IRC;