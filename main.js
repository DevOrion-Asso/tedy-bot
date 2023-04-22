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

client.config = require("./data/config");

const fs = require("node:fs"),
    path = require("node:path"),
    colors = require("colors/safe");

const { DeploySlashCommands } = require("./data/dep-commands");
DeploySlashCommands(
    client.config.guildId,
    client.config.clientId,
    client.config.token
);

module.exports = client,

client.commands = new Collection();
client.modals = new Collection();

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

const modals = fs.readdirSync(`./modals/`).filter(file => file.endsWith('.js'));

for (let file of modals) {

    let pull = require(`./modals/${file}`);
    if (pull.id) {
        client.modals.set(pull.id, pull);
        console.log(colors.green('[SUCCES]') + " " + `Loaded a ${file} file !`)
    } else {
        console.log(colors.yellow('[WARNING]') + " " + `Couldn't load a ${file} file !`)
        continue;
    }
};
