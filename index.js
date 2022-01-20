/**
 * @Discord-Bot : Cuddles
 */

const Discord = require('discord.js');
const { prefix, token, giphyToken, author_id } = require('./config.json'); // config related variables
const { animeGifs, fGifs } = require('./arraylist.json'); // Links to all giphy gifs are stored here
const GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);
const client = new Discord.Client();

// Start up process - using token (via config.json) found here: https://discordapp.com/developers/applications/me
client.login(token).then(() => { console.log("Cuddles login complete")});
client.once('ready', () => {
	// noinspection JSCheckFunctionSignatures
	/**
	 * @setPresence
	 * @status : 'online', 'idle', 'offline', 'dnd'
	 * @name : 'game'
	 * @type : 'PLAYING', 'STREAMING' (doesn't seem to work?), 'LISTENING', 'WATCHING'
	 */
	client.user.setPresence({
		status: 'idle',
		game: {
			name: 'cat videos',
			type: 'WATCHING'
		}
	}).then(() => { console.log("Presence set")});
});

// Command list
client.on('message', message => {
	// Help command
	if (message.content.startsWith(`${prefix}help`)){
		message.channel.send(
			'```# Help Commands\
			\n# \
			\n# All commands start with prefix !\
			\n# 1) temp [c/f] [no.] = Returns the C/F value of the inputted number. \
			\n# 2) roll [num] = Returns a dice roll (4, 6, 8, 10, 12, 20, or 100) based on input. \
			\n# 3) rn [num] = Returns a random number between 1 and the inputted number. \
			\n# 4) time = Returns the time for Australian Central, American Eastern and Western timezones based on local city times. \
			\n# 5) coin flip [h/t] = Flips a coin. Heads, or tails?\
			\n# 6) smug (var) = Returns an anime smug gif.\
			\n# 7) f (var) = Returns a salute gif, paying your respects.\
			\n# 8) avatar (mention) = Returns an embed picture of the user or mentioned avatar.\
			\n# 9) server = Returns an embed picture of the servers icon.\
			\n# \
			\n# [required field] (optional field)\
			\n# If you would like to see additional commands added, please request them.```'
		);
	}
	
	// Ping pong message
	if (message.content.startsWith(`${prefix}ping`)) {
		pingPong(message);
	}
	// Temperature conversion
	else if (message.content.startsWith(`${prefix}temp`)) {
		temperatureConversion(message);
	}
	// Dice
	else if (message.content.startsWith(`${prefix}roll`)) {
		diceRoll(message);
	}
	// Random number range
	else if (message.content.startsWith(`${prefix}rn`)) {
		randomNumber(message);
	}
	// Smug gif
	else if (message.content.startsWith(`${prefix}smug`)) {
		generateSmugGif(message);
	}
	// Coin flip h/t
	else if (message.content.startsWith(`${prefix}coin flip`)) {
		coinFlip(message);
	}
	// F to pay respects
	else if (message.content.startsWith(`${prefix}f`)) {
		generateRespectGif(message);
	}
	//Timezone - ACST, EST, & PST
	else if (message.content.startsWith(`${prefix}time`)) {
		timezones(message);
	}
	// Avatar/icon of user or mentioned user
	else if (message.content.startsWith(`${prefix}avatar`)) {
		embedAvatarIcon(message);
	}
	// Server (guild) avatar/icon
	else if (message.content.startsWith(`${prefix}server`)) {
		embedServerIcon(message);
	}
	// Server information
	else if(message.content.startsWith(`${prefix}s-info`)) {
		serverInformation(message);
	}
	// User information
	else if (message.content.startsWith(`${prefix}u-info`)) {
		userInformation(message);
	}
	// Cuddles direct messages the user
	else if (message.content.startsWith(`${prefix}hi`)) {
		messageUser(message);
	}
  else if (message.isMentioned(client.user) && !message.author.bot){
		userMentionsBot(message);
	}
	//Say command
	else if (message.content.startsWith(`${prefix}say`)){
		botMessageForUser(message);
	}

	/**
	 * Cuddles will react with an emote if a particular phrase is mentioned
	 * @todo Content includes is case sensitive, should all lower case it
	 */
	if (message.content.toLowerCase().includes('kill me')) {
		messageReact(message, "frogeKms");
	}
	if (message.content.toLowerCase().includes('i love you')) {
		messageReact(message, "blobcatheart");
	}
	if (message.content.toLowerCase().includes('fire')) {
		messageReact(message, "thisisfine");
	}
	if (message.content.toLowerCase().includes('i hate sand')) {
		messageEmbed(message, "https://media.giphy.com/media/PKgfwX7ct5f5C/giphy.gif");
	}
	if (message.content.toLowerCase().includes('you underestimate my power')) {
		messageEmbed(message, "https://media.giphy.com/media/FXiLqLk921kOs/giphy.gif"); //@todo This is broken since the link doesn't work anymore, content was removed
	}
	if (message.content.toLowerCase().includes('shame on you sweet nerevar')) {
		message.channel.send("https://www.youtube.com/watch?v=iR-K2rUP86M");
	}

	// @todo Resolve the below function
	//THEORY - need test, no idea if this works even remotely - on join apply a role
	// client.on('guildMemberAdd', guildMember => {
	// 	// Set the member's roles to a single role
	// 	if (client.guilds.get(message.guild.id).id == 503178803477086208){ //Private friends discord
	// 		guildMember.setRoles(['503194198581837844']) //"Clean" role I believe
	// 		.then(console.log)
	// 		.catch(console.error);
	// 	}
	// });

	//Giphy Search
	//The reference for emojis only works on my personal discord, unsure how it works on others -----
	// @todo Its broken at the moment, will need to fix it since it's uploading a file instead of posting gif in chat
	let smugRef = ["606767823280144385", "606776274551177247", "607150963375079430", "607150995318898699"];
	if (message.content.startsWith(`${prefix}gif`)){
		//let member = message.mentions.members.first(); //<= In case want to @ later on
		giphy.search('gifs', {"q": "smug"}).then ((response) => {
			let totalResponses = response.data.length;
			let responseIndex = Math.floor((Math.random() *10) + 1) % totalResponses;
			let responseFinal = response.data[responseIndex];
			let smugNum = Math.floor(Math.random() * smugRef.length);
			message.channel.send("Get smugged <:smug"+smugNum+":"+smugRef[smugNum]+">", { files: [responseFinal.images.fixed_height.url] });
			console.log(responseFinal.images.fixed_height);
		}).catch(() => {message.channel.send('Error!');})
	}

/*
Spam Command, un-comment with CTRL+/ when want to use the spam command.
*/
	// if(message.content.startsWith(`${prefix}spam`)){
	// 	var input = message.content.split(' ');
	// 	message.delete();
	// 	for(i=0;i<input[1];i++){
	// 		message.channel.send("Ya yeet "+i);
	// 		if(input[2] == 'd'){
	// 			//let channel = client.channels.get("7");
	// 			message.channel.fetchMessages({ limit: 1 }).then(messages => {
	// 				let lastMessage = messages.first();
	// 				if (lastMessage.author.bot) {
	// 				  lastMessage.delete();
	// 				}
	// 			}).catch(console.error);
	// 		}
	// 	}
	// }

	// Message Deletion, specify an amount of messages to delete and Cuddles will do so.
	if(message.content.startsWith(`${prefix}clear`)){
		clearMessages(message);
	}

});
/**
 *  END CLIENT.ON
 **/

/**
 * @pingPong
 * @param message
 *
 * Cuddles will send Pong! back to the user
 */
function pingPong(message) {
	message.channel.send("Pong!");
}

/**
 * @temperatureConversion
 * @param message
 *
 * Allows the user to conversion a specific number from C to F and vice versa
 * @Example: !temp c 50
 * @Output: 50F is equal to 10.00C
 */
function temperatureConversion(message) {
	const args = message.content.split(' ');

	if (args[1] === "c") {
		message.channel.send(args[2] + "F is equal to " + ((args[2]-32)/1.8).toFixed(2) + "C");
	}
	else if (args[1] === "f") {
		message.channel.send(args[2] + "C is equal to " + ((args[2] * 1.8) + 32).toFixed(2) + "F");
	}
	else message.channel.send("Error! C or F not chosen!");
}

/**
 * @diceRoll
 * @param message
 * @returns {*}
 */
function diceRoll(message) {
	const diceNum = message.content.split('dr');
	let num;

	// Rolling number
	switch (parseInt(diceNum[1])) {
		case 4:   num = Math.floor(Math.random() * 4) + 1;    break;
		case 6:   num = Math.floor(Math.random() * 6) + 1;    break;
		case 8:   num = Math.floor(Math.random() * 8) + 1;    break;
		case 10:  num = Math.floor(Math.random() * 10) + 1;   break;
		case 12:  num = Math.floor(Math.random() * 12) + 1;   break;
		case 20:  num = Math.floor(Math.random() * 20) + 1;   break;
		case 100: num = Math.floor(Math.random() * 100) + 1;  break;
		default: message.channel.send("Please input a correct dice roll!");
	}

	//Final output
	const numTxt = "Rolled number: " + num;
	message.channel.send(numTxt);
}

/**
 * @randomNumber
 * @param message
 */
function randomNumber(message) {
	const input = message.content.split(' ');

	if (!isNaN(input[1])) {
		let num = Math.floor(Math.random() * parseInt(input[1])) + 1;
		message.channel.send("Rolled number: " + num);
	}
	else message.channel.send("Error! Please provide a number!");
}

/**
 * @generateSmugGif
 * @param message
 */
function generateSmugGif(message) {
	const gifNum = Math.floor(Math.random() * animeGifs.length);
	let member = message.mentions.members.first();
	if (!member) {
		member = "";
	}

	message.channel.send('Get Smugged ' + member, {
		embed: {
			color: 1752220,
			description:"",
			image:  {url: animeGifs[gifNum]}
		}
	});
}


/**
 * @coinFlip
 * @param message
 */
function coinFlip(message) {
	const input = message.content.split(' ');
	let inputString = input[1];
	let num = Math.floor(Math.random() * 2);
	let output;

	// Heads or Tails text writing
	if (num === 0) { //Heads
		output = "Heads!";
	}
	else if (num === 1) { //Tails
		output = "Tails!";
	}

	// Reading the heads or tails choice and the generated answer, checking if they match and posting
	if (!inputString) {
		message.channel.send("You didn't say heads or tails!");
	}
	else if ((inputString === "h" && num === 0) || (inputString === "t" && num === 1)) {
		output += " You win!";
	}
	else output += " You lose!";

	message.channel.send(output);
}

/**
 * @generateRespectGif
 * @param message
 */
function generateRespectGif(message) {
	const input = message.content.split(' ');
	message.delete(); // Deleting the original message - this isn't strictly needed
	let author = message.author.username;
	let member = message.mentions.members.first();
	let outputExtra = ' to ';

	if (!member && input[1] !== null) {
		for (let i = 1; i < input.length; i++) {
			outputExtra += input[i];
		}
	}
	else if (!member) {
		outputExtra = "";
	}
	else outputExtra += member;

	message.channel.send(author + ' has paid respects' + outputExtra, {
	  embed: {
		  color: 1752220,
			description: "",
			image: {
				url: fGifs[0]
			}
		}
	});
}

/**
 * @timezones
 * @param message
 */
function timezones(message) {
	let adelaide = new Date().toLocaleString("en-US", {timeZone: "Australia/Adelaide"});
	let usEast = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
	let usWest = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
	let ukLon = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});

	adelaide = new Date(adelaide);
	usEast = new Date(usEast);
	usWest = new Date(usWest);
	ukLon = new Date(ukLon);

	message.channel.send("```AUS Central: "+adelaide.toLocaleString()+"\nUS East: "+usEast.toLocaleString()+"\nUS West: "+usWest.toLocaleString()+"\nUK: "+ukLon.toLocaleString()+"```");
}

/**
 * @embedAvatarIcon
 * @param message
 */
function embedAvatarIcon(message) {
	let user = message.mentions.users.first();
	let embed;

	if(user == null) {
		embed = new Discord.RichEmbed()
			.setImage(message.author.displayAvatarURL)
			.setColor('#275BF0');
	}
	else {
		embed = new Discord.RichEmbed()
			.setImage(user.avatarURL())
			.setColor('#275BF0');
	}

	message.channel.send(embed);
}

/**
 * @embedServerIcon
 * @param message
 */
function embedServerIcon(message) {
	let embed = new Discord.RichEmbed()
		.setImage(client.guilds.get(message.guild.id).iconURL)
		.setColor('#275BF0');

	message.channel.send(embed);
}

/**
 * @serverInformation
 * @param message
 */
function serverInformation(message) {
	let embed = new Discord.RichEmbed()
		.setColor('#275BF0')
		.addField("Server Creation: ", client.guilds.get(message.guild.id).createdAt);

	message.channel.send(embed);
}

/**
 * @userInformation
 * @param message
 */
function userInformation(message) {
	let user = message.mentions.users.first();
	if (!user) {
		user = message.author;
	}

	let embed = new Discord.RichEmbed()
		.setColor('#275BF0')
		.addField("Name: ",`${user.username}#${user.discriminator}`);
	user = message.guild.member(user); // Believe this needs to be called here because the username and discriminator cannot be called from guild.member
	embed.addField("Server Join Date: ", `${user.joinedAt}`)
		.addField("Status: ", `${user.presence.status}`);

	message.channel.send(embed);
}

/**
 * @messageUser
 * @param message
 */
function messageUser(message) {
	if(message.author.id === author_id){
		message.author.send('hi owo');
	}
	else message.author.send('I-I dont have permission to speak to strangers!');
}

/**
 * @userMentionsBot
 * @param message
 */
function userMentionsBot(message) {
	let embed = new Discord.RichEmbed().setColor('#275BF0');
	if (message.content.includes('execute order 66')) {
		message.channel.send(embed
			.addField('Hologram Cuddles appears','It will be done, my lord.')
			.setImage('https://media.giphy.com/media/tdSX6eAPcxeec/giphy.gif'));
	}
	else if(message.content.includes(`let it burn`)) {
		message.channel.send(embed.setImage('https://media.giphy.com/media/yr7n0u3qzO9nG/giphy.gif'));
	}
	else if(message.content.includes('you know what to do')) {
		message.channel.send(embed.setImage("https://media.giphy.com/media/lv6noBMLsK0gM/giphy.gif"));
	}
	else message.channel.send('(。O⁄ ⁄ω⁄ ⁄ O。)');
}

/**
 * @messageReact
 * @param message
 * @param emoteName
 */
function messageReact(message, emoteName) {
	const paste = client.emojis.find(emoji => emoji.name === emoteName);
	message.react(paste);
}

/**
 * @messageEmbed
 * @param message
 * @param embedData
 */
function messageEmbed(message, embedData) {
	let embed = new Discord.RichEmbed().setColor('#275BF0');
	message.channel.send(embed.setImage(embedData));
}

/**
 * @botMessageForUser
 * @param message
 */
function botMessageForUser(message) {
	message.delete(); // Deleting the message from chat
	message.channel.send(message.content.slice(4, message.content.length));
}

/**
 * @clearMessages
 * @param message
 * @returns {string}
 */
function clearMessages(message) {
	if (message.member.guild.me.hasPermission('ADMINISTRATOR') || message.member.guild.me.hasPermission('MANAGE_MESSAGES')) {
		let input = message.content.split(' ');
		message.delete();

		if (input[1] > 0 && input[1] < 100) {
			message.channel.send("Please wait, this might take a moment.");

			for (let i = 0; i < input[1] ; i++) {
				message.channel.fetchMessages({ limit: input[1] }).then(messages => { // @todo figure out why "messages" is buggered
					message.channel.bulkDelete(input[1])
				}).catch(console.error);
			}
		}
		else return 'Error! Invalid number!'; // @todo review this functionality, I don't understand from a glance why I'm returning static text
	}
	else return 'You are not an admin!';
}