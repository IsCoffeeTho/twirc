const tuser  = require("./user");

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

module.exports = {
	raid: eventRaid,
	announcement: eventAnnouncement,
	message: eventMessage
}