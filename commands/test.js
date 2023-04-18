const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction, client, db) {
        await interaction.reply({
            content: `test`
        });
	},
};