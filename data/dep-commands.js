const {
    REST, Routes
} = require("discord.js");

const fs = require("node:fs"),
    path = require("node:path"),
    colors = require("colors/safe");

async function DeploySlashCommands(clientId, token) {
    const commands = [];
    
    const commandFiless = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiless) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
    }
    
    const rest = new REST({ version: '10' }).setToken(token);
    
    (async () => {
        try {
            console.log(colors.blue('[LOADING]') + " " + colors.magenta(`Loading of`) + " " + colors.red(commands.length) + " " + colors.magenta('application commands.'))
    
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(colors.green('[SUCCES]') + " " + colors.magenta(`Succes of loading of`) + " " + colors.red(data.length) + " " + colors.magenta('application commands.'))
        } catch (error) {
            console.error(error);
        }
    })();
};

module.exports = {
    DeploySlashCommands
};