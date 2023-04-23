const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Permet de vous fournir le lien de vote pour le serveur !'),
	async execute(client, interaction, db) {
        const mesg = await interaction.deferReply();
		
        await wait(3000);
		
        await interaction.editReply({
            content: `${client.emoji.purplecercle} https://discordinvites.net/vote/998363750862168184`,
        });
	},
};