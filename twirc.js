const EventEmitter = require("events");
const irc = require("./src/irc");
const tchannel = require("./src/channel");

class twirc extends EventEmitter {
	/** 
	 *	For more information please refer to the docs:
	 *
	 *	https://github.com/IsCoffeeTho/twirc/wiki
	*/
	constructor(options = {
		identity: {
			username: "",
			token: ""
		}
	}) {
		super();
		if (typeof options.identity != 'object')
			throw new Error(`Please pass an identity object`);
		if (!options.identity['username'] || !options.identity['token'])
			throw new Error(`'indentity' requires the fields: username, token`);
		this.username = options.identity.username.toLocaleLowerCase();
		this._channels = {};
		this.socket;
		this.irc = new irc("ws://irc-ws.chat.twitch.tv:80");
		this.irc.on("open", (sock) => {
			this.socket = sock;
			sock.capReq("twitch.tv/membership", "twitch.tv/tags", "twitch.tv/commands");
			sock.authenticate(this.username, `oauth:${options.identity.token}`);
			sock.on("message", (ircmsg) => {
				if (ircmsg.command == "001") return this.emit("ready");
				if (ircmsg.channel)
					if (this._channels[ircmsg.channel.slice(1)])
						this._channels[ircmsg.channel.slice(1)]._message(ircmsg);
			});
		});
		this.irc.on("error", (error) => {
			console.error(error);
			this.emit("error", error);
		});
	}

	/** returns a channel hook */
	hookChannel(channelName) {
		return new Promise((res, rej) => {
			if (this._channels[channelName])
				rej(new Error(`Can't Hook onto a channel that is already hooked.`));
			else {
				this._channels[channelName] = new tchannel(channelName, this);
				this._channels[channelName].once('hooked', () => {
					res(this._channels[channelName]);
				});
				this._channels[channelName].once('bad-hook', () => {
					res(this._channels[channelName]);
				});
			}
		});
	}

	/** Will forceably close IRC*/
	shutdown() {
		this.IRCWS.abort();
	}
}

module.exports = twirc;
exports = twirc;