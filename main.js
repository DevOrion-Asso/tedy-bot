const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

module.exports = client;

client.config = require('./data/config');

client.login(client.config.token);

const fs = require("node:fs"),
    path = require("node:path"),
    colors = require("colors/safe");

const { DeploySlashCommands } = require("./data/dep-commands");
DeploySlashCommands(
    client.config.clientId,
    client.config.token
);

client.commands = new Collection();

client.login(client.config.token);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
	    client.once(event.name, (...args) => event.execute(...args));
    } else {
	    client.on(event.name, (...args) => event.execute(...args));
    };
};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(colors.yellow('[WARNING]') + " " + colors.magenta(`The command ar ${filePath} is missing a required "data" or "execute" proprety.`));
    };
};