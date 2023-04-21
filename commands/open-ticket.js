const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open-ticket')
		.setDescription('Vous permet d\'ouvrir un ticket sur le Discord !'),
	async execute(client, interaction) {
        interaction.reply({
            content: `${client.config.emojiNo} Pour le moment, l'ouverture de ticket sur le **Discord** n'est pas possible.`,
            ephemeral: true
        });
	},
};