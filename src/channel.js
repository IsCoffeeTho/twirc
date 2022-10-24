const EventEmitter = require("events");

class tchannel extends EventEmitter {
	#parent;

	constructor(channelName = "", parent) {
		super();
		this.#parent = parent;
		console.log(parent.constructor.name);
		console.log(parent.socket.constructor.name);
		this.#parent.socket.send(`JOIN #${this.channel}`);
		this.name = channelName.toLocaleLowerCase();
	}

	_message(ircmsg) {
		// if (irc)
	}

	say(...msgs) {
		for (var i in msgs) {
			var msg = msgs[i];
			this.#parent.socket.sendUTF(`PRIVMSG #${this.channel} :${msg}`);
		}
	}

	unhook() {
		this.#parent.socket.sendUTF(`PART #${this.channel}`);
		this.#parent.channels[this.name] = undefined;
	}
}

module.exports = tchannel;