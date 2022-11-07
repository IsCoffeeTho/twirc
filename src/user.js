class tuser {
	constructor (ircmsg) {
		this.name = (ircmsg ? ircmsg.tags['login'] : ""),
		this.display_name = (ircmsg ? ircmsg.tags['display-name'] : ""),
		this.badges = (ircmsg ? [
			...(ircmsg.tags.badges ? Object.keys(ircmsg.tags.badges) : [])
		] : [])
		this.chat_color = (ircmsg ? ircmsg.tags['color'] : "#000000")
		this.mod = (ircmsg ? (ircmsg.tags['mod'] == '1' ? true : false) : false);
		this.subscriber = (ircmsg ? (ircmsg.tags['founder'] == '1' ? true : (ircmsg.tags['subscriber'] == '1' ? true : false)) : false);
		if (ircmsg)
		{
			if (ircmsg.tags['subscriber'] == '1')
				this.subbed_for = ircmsg.tags['badge-info']['subscriber'];
			if (ircmsg.tags['founder'] == '1')
				this.subbed_for = ircmsg.tags['badge-info']['founder'];
		}
		this.staff = (ircmsg ?(ircmsg.tags['user-type'] != null ? true : false) : false);
	};
}

module.exports = tuser;