const twirc = require("../twirc");
const tuser = require("./user");

/** This event will occur every time a user subscribes to a channel
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.sub
*/
class eventSub {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.user = new tuser(ircmsg);
		this.tier = ["Prime", "1000", "2000", "3000"].indexOf(ircmsg.tags['msg-param-sub-plan']);
		this.name = ircmsg.tags['msg-param-sub-plan-name'];
		this.months = parseInt(ircmsg.tags['msg-param-streak-months']) - parseInt(ircmsg.tags['msg-param-should-share-streak']);
	}
}

/** This event will occur every time a user sends a gifted sub on a channel
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.subgift
*/
class eventSubGift {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.sender = new tuser(ircmsg);
		this.recipient = new tuser();
			this.recipient.name = ircmsg.tags['msg-param-recipient-user-name'];
			this.recipient.display_name = ircmsg.tags['msg-param-recipient-display-name'];
			this.recipient.id = ircmsg.tags['msg-param-recipient-id'];
		this.tier = ["Prime", "1000", "2000", "3000"].indexOf(ircmsg.tags['msg-param-sub-plan']);
		this.name = ircmsg.tags['msg-param-sub-plan-name'];
		this.months = parseInt(ircmsg.tags['msg-param-months']);
	}
}

/** This event will occur every time the channel gets raided by another
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.raid
*/
class eventRaid {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.raider = new tuser(ircmsg);
		this.party_size = ircmsg.tags['msg-param-viewerCount'];
	}
}

/** This event will occur every time the `/announce` command occurs in a channel
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.raid
*/
class eventAnnouncement {
	constructor(ircmsg, channel) {
		this.channel = channel;
		this.content = ircmsg.parameter;
		this.user = new tuser(ircmsg);
	}
}

/** This event will occur every time the channel gets raided by another
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.raid
*/
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

/** This event will occur every time someone cheers to a channel
 * 
 *  See https://github.com/IsCoffeeTho/twirc/wiki/ref.tevents.cheer
*/
class eventBits {
	constructor(ircmsg, channel) {
		this.bits = 0;
		this.content = ircmsg.parameters.replace(
			/(Cheer|Kappa|Kreygasm|Swiftrage|4Head|PJSalt|MrDestructoid|TriHard|NotLikeThis|FailFish|VoHiYo)(\d+)\s+/g,
			(match, type, bits) => {
				this.bits += parseInt(bits);
				return match;
			}
		);
		this.channel = channel;
		this.user = new tuser(ircmsg);
	}
}

module.exports = {
	sub: eventSub,
	giftSub: eventSubGift,
	raid: eventRaid,
	announcement: eventAnnouncement,
	message: eventMessage,
	cheer: eventBits
}