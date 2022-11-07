const tuser  = require("./user");

class eventSub {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.sub = new tuser(ircmsg);
		this.party_size = ircmsg.tags['msg-param-viewerCount'];
	}
}

class eventSubGift {
	constructor(ircmsg, channel) {
		this.channel = channel;
	}
}

class eventRaid {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.raider = new tuser(ircmsg);
		this.party_size = ircmsg.tags['msg-param-viewerCount'];
	}
}

class eventAnnouncement {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.content = ircmsg.parameter;
		this.announcer = new tuser(ircmsg);
	}
}

class eventMessage {
	constructor(ircmsg, channel) {
		this.content = ircmsg.parameters;
		this.channel = channel;
		this.id = ircmsg.tags['id'];
		this.user = new tuser(ircmsg);
	}

	reply(...msgs) {
		for (var i in msgs) {
			var msg = msgs[i];
			this.channel._socket.send(`@reply-parent-msg-id=${this.id} PRIVMSG #${this.channel.name} :${msg}`);
		}
	}
}

class eventBits {
	constructor(ircmsg, channel) {
		this.bits = 0;
		this.content = ircmsg.parameters.replace(
			/(Cheer|Kappa|Kreygasm|Swiftrage|4Head|PJSalt|MrDestructoid|TriHard|NotLikeThis|FailFish|VoHiYo)(\d+)\s+/g,
			(match, type, bits) => {
				this.bits += parseInt(bits);
				return "";
			}
		);
		this.channel = channel;
		this.id = ircmsg.tags['id'];
		this.user = new tuser(ircmsg);
	}
}

module.exports = {
	raid: eventRaid,
	announcement: eventAnnouncement,
	message: eventMessage,
	cheer: eventBits
}