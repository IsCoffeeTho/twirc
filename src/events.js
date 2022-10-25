class eventRaid {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.raider = {
			name: ircmsg.tags['display-name'],
			badges: [
				...(ircmsg.tags.badges ? Object.keys(ircmsg.tags.badges) : [])
			],
			chat_color: ircmsg.tags['color'],
			mod: (ircmsg.tags['mod'] == '1' ? true : false),
			subscriber: (ircmsg.tags['subscriber'] == '1' ? true : false),
			...(ircmsg.tags['subscriber'] == '1' ? {
				subbed_for: ircmsg.tags['badge-info']['subscriber']
			} : {}),
			staff: (ircmsg.tags['user-type'] != null ? true : false)
		}
		this.party_size = ircmsg.tags['msg-param-viewerCount'];
	}
}

class eventAnnouncement {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.content = ircmsg.parameter;
		this.announcer = {
			name: ircmsg.tags['display-name'],
			badges: [
				...(ircmsg.tags.badges ? Object.keys(ircmsg.tags.badges) : [])
			],
			chat_color: ircmsg.tags['color'],
			mod: (ircmsg.tags['mod'] == '1' ? true : false),
			subscriber: (ircmsg.tags['subscriber'] == '1' ? true : false),
			...(ircmsg.tags['subscriber'] == '1' ? {
				subbed_for: ircmsg.tags['badge-info']['subscriber']
			} : {}),
			staff: (ircmsg.tags['user-type'] != null ? true : false)
		};
	}
}

class eventMessage {
	constructor(ircmsg, channel) {
		this.content = ircmsg.parameters;
		this.channel = channel;
		this.id = ircmsg.tags['id'];
		this.user = {
			username: ircmsg.source.nick,
			display_name: ircmsg.tags['display-name'],
			badges: (ircmsg.tags['badges'] ? [
				...Object.keys(ircmsg.tags['badges'])
			] : []),
			subscribed: (ircmsg.tags['subscriber'] ? true : false),
			mod: (ircmsg.tags['mod'] == '1' ? true : false),
			vip: (ircmsg.tags['vip'] == null ? true : false)
		}
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