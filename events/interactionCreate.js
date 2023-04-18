const { Events, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const colors = require("colors/safe");

const { QuickDB } = require('quick.db');
const db = new QuickDB();

const client = require("../main");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No order match ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            if (db.get(`bot_close`) == true && !interaction.members.roles.has('1098013995107110983')) {
                await interaction.deferReply({ ephemeral: true });
                await wait(2000);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(':x: Bot en maintenance !')
                    ],
                    ephemeral: true
                })
            } else {
                await command.execute(interaction, client, db);
            };
        } catch (error) {
            //console.log(colors.magenta('[ERROR]') + "\n" + colors.red(error));
        }
	},
};