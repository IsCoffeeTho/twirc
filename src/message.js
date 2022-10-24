class tmsg
{
	#ws;

	constructor({connection, raw, channel})
	{
		this.#ws = connection;
		this.content = raw.parameters;
		this.channel = raw.command.channel.slice(1),
		this.user = {
			username: raw.source.nick,
			...raw.tags
		}
		this.self = false;
	}

	replyMention (...msgs)
	{
		for (var i in msgs)
		{
			var msg = msgs[i];
			this.#ws.sendUTF(`@reply-parent-msg-id=${this.user.id} PRIVMSG #${this.channel} :${msg}`);
		}
	}

	reply (...msgs)
	{
		for (var i in msgs)
		{
			var msg = msgs[i];
			this.#ws.sendUTF(`PRIVMSG #${this.channel} :${msg}`);
		}
	}
}

module.exports = tmsg;