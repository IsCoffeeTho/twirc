const EventEmitter = require("events");
const irc = require("./irc");
const tmsg = require("./message");

class twirc extends EventEmitter
{
	/** For more information please refer to the docs:
	 * 
	 * 	https://github.com/IsCoffeeTho/twirc/wiki
	*/
	constructor(options = {
		debug: false,
		identity : {
			username: "",
			token: ""
		}
	})
	{
		super();
		if (typeof options.debug != 'boolean')
			this.debug = false;
		else
			this.debug = options.debug;
		if (typeof options.identity != 'object')
			throw new Error(`Please pass an identity object`);
		if (!options.identity['username'] || !options.identity['token'])
			throw new Error(`'indentity' requires the fields: username, token`);
		this._identity = {
			_username: options.identity.username,
			_token: options.identity.token
		};
		if(this.debug)console.log("WS CONNECTING");
		this.irc = new irc("ws://irc-ws.chat.twitch.tv:80");
		this.irc.on("join", (sock) => {
			sock.capReq("twitch.tv/membership", "twitch.tv/tags", "twitch.tv/commands");
			sock.authenticate(this._identity._username, `oauth:${this._identity._token}`);
		});
		this.irc.on("error", (error) => {
			console.error(error);
		});
	}

	/** returns a channel hook */
	hookChannel(channelName)
	{
		if (this.channels[channelName])
			return this.channels[channelName];
		
		return 
	}

	/** Will forceably close IRC*/
	shutdown()
	{
		this.IRCWS.abort();
	}
}

module.exports = twirc;