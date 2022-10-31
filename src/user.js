class tuser {
	constructor (ircmsg) {
		this.name = ircmsg.tags['display-name'];
		this.badges = [
			...(ircmsg.tags.badges ? Object.keys(ircmsg.tags.badges) : [])
		];
		this.chat_color = ircmsg.tags['color'];
		this.mod = (ircmsg.tags['mod'] == '1' ? true : false);
		this.subscriber = (ircmsg.tags['subscriber'] == '1' ? true : false);
	 	if (ircmsg.tags['subscriber'] == '1')
			this.subbed_for = ircmsg.tags['badge-info']['subscriber'];
		this.staff = (ircmsg.tags['user-type'] != null ? true : false);
	};
}

module.exports = tuser;