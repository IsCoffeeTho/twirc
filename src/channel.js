const EventEmitter = require("events");
const tevents = require("./events");

class tchannel extends EventEmitter {
	#parent;
	#state;

	constructor(channelName = "", parent) {
		super();
		this.#parent = parent;
		this._socket = this.#parent.socket;
		this.name = channelName.toLocaleLowerCase();
		this.emote_only = false;
		this._socket.send(`JOIN #${this.name}`);
		this.#state = 0;
	}

	_message(ircmsg) {
		switch (ircmsg.command) {
			case "USERSTATE":
				this.badges = [
					...(ircmsg.tags.badges ? Object.keys(ircmsg.tags.badges) : [])
				]
				this.chat_color = ircmsg.tags['color'];
				this.is_mod = (ircmsg.tags['mod'] == '1' ? true : false);
				this.is_subscriber = (ircmsg.tags['subscriber'] == '1' ? true : false);
				this.is_staff = (ircmsg.tags['user-type'] != null ? true : false);
				break;
			case "ROOMSTATE":
				this.emote_only = (ircmsg.tags['emote-only'] == 1 ? true : false);
				this.subs_only = (ircmsg.tags['subs-only'] == 1 ? true : false);
				this.followers_only = (ircmsg.tags['followers-only'] == 1 ? true : false);
				this.slow_mode = (ircmsg.tags['slow'] > 0 ? true : false);
				this.unique_mode = (ircmsg.tags['r9k'] > 0 ? true : false);
				this.timeout_time = ircmsg.tags['slow'];
				if (this.#state == 0)
					this.#state = 1;
				else
					this.emit("state_change");
				break;
			case "PRIVMSG":
				if (ircmsg.parameters.match(/(Cheer|Kappa|Kreygasm|Swiftrage|4Head|PJSalt|MrDestructoid|TriHard|NotLikeThis|FailFish|VoHiYo)\d+/g))
					this.emit("bits", new tevents.cheer(ircmsg, this));
				else
				this.emit("chat", new tevents.message(ircmsg, this));
				break;
			case "USERNOTICE":
				switch (ircmsg.tags['msg-id']) {
					case "announcement":
						this.emit("announcement", new tevents.announcement(ircmsg, this));
						break;
					// case "subgift": break;
					case "sub":
					case "resub":
						this.emit("sub", new tevents.subscription(ircmsg, this));
						break;
					case "raid":
						this.emit("raided", new tevents.raid(ircmsg, this));
						break;
					default:
						console.log(`unhandled ${ircmsg.command}:`);
						console.log(`= ${ircmsg.command} ${'='.repeat(77 - ircmsg.command.length)}`);
						console.log(ircmsg.parameters);
						console.log(ircmsg.tags);
						console.log(ircmsg.raw);
						console.log('='.repeat(80));
						break;
				}
				break;
			case "JOIN":
				if (ircmsg.source.nick == this.#parent.username)
					this.emit("hooked")
				break;
			case "PART":
				if (ircmsg.source.nick == this.#parent.username)
					this.emit("close")
				break;
			case "NOTICE":
				if (!ircmsg.tags['msg-id'].startsWith('usage_'))
				{
					if (ircmsg.tags['msg-id'].startsWith('already_'))
					{
						
					}
				}
				break;
			default: 
					console.log(`unhandled IRC command "${ircmsg.command}":`);
					console.log(`= ${ircmsg.command} ${'='.repeat(77 - ircmsg.command.length)}`);
					console.log(ircmsg.parameters);
					console.log(ircmsg.tags);
					console.log(ircmsg.raw);
					console.log('='.repeat(80));
				break;
		}
	}

	say(...msgs) {
		for (var i in msgs) {
			var msg = msgs[i];
			this._socket.send(`PRIVMSG #${this.name} :${msg}`);
		}
	}

	unhook() {
		this._socket.send(`PART #${this.channel}`);
		this.#parent.channels[this.name] = undefined;
	}
}

module.exports = tchannel;