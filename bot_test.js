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
	debug: true,
	identity: identity
});

const ChannelToHook = "iscoffeetho";

app.on("ready", () => {
	console.log(`Ready on ${app.username}`);
	app.hookChannel(ChannelToHook).then((channel) => {
		console.log(`Hooked to ${channel.name}`);

		channel.on('chat', (message) => {
			if (message.content.startsWith("!")) {
				var mes_seg = message.content.split(" ");
				switch (mes_seg[0].slice(1)) {
					case "testcmd":
						message.reply("This is a test reply");
						break;
					case "testerr":
						channel.say(`/ban ${ChannelToHook}`);
						break;
				}
			}
		});

		channel.on('sub', (sub) => {
			console.log(`${sub.name}`);
		});

		channel.on('raid', (raid) => {
			console.log(`${raid.raider.name} raided with ${raid.party_size} viewers`);
		});

		channel.on('announcement', (e) => {
			
		});

		channel.on('error', (err) => {
			console.error(err);
			channel.unhook();
		});

	}).catch((err) => {
		console.error(err);
	});
});