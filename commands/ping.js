const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Envoie la latence du bot !'),
	async execute(interaction, client, db) {
        const mesg = await interaction.deferReply({ content: ":ping_pong: Pong !", fetchReply: true });
		
        await wait(3000);
		
        await interaction.editReply({
            content: `:ping_pong: Pong !\n> Here is my latency: \`${mesg.createdTimestamp - interaction.createdTimestamp} ms\``
        });
	},
};