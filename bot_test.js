const twirc = require("./twirc");

const identity = require("./.testbotinfo.json");

/*
	Get token at
		https://id.twitch.tv/oauth2/authorize
			?client_id=ahwrqla24srqfjtcs4ducjqvza1kji
			&redirect_uri=http://localhost:3001/oauth/twitch
			&response_type=token
			&scope=
				chat%3Aread
				+chat%3Aedit
				+user%3Aedit
*/

const app = new twirc({
	debug : true,
	identity: identity
});

const ChannelToHook = "iscoffeetho";

app.on("ready", () => {
	app.hookChannel(ChannelToHook).then((channel) => {
		console.log(`Hooked to ${channel.name}`);
		
		channel.on('chat', () => {
			
		});

		channel.on('subed', () => {
			
		});

		channel.on('raided', () => {
			
		});

		channel.on('hosted', () => {
			
		});

		channel.on('hosting', () => {
			
		});

		channel.on('error', (err) => {
			console.error(err);
			channel.unhook();
		});

	}).catch((err) => {
		console.error(err);
	});
});