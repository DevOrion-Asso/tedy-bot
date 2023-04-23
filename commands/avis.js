const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avis')
		.setDescription('Permet de vous fournir le lien de vote pour le serveur !')
        .addNumberOption(option => option
            .setName('note')
            .setDescription('Choisissez une note entre 1 et 10')
            .setMaxValue(10)
            .setMinValue(1)
            .setRequired(true))
        .addStringOption(option => option
            .setName('avis')
            .setDescription('Donnez votre avis !')
            .setRequired(true)),
	async execute(client, interaction, db) {
        const mesg = await interaction.deferReply({ ephemeral: true });
		
        await wait(1000);
		
        await interaction.editReply({
            content: `${client.emoji.no} Commande non disponible pour le moment.`,
            ephemeral: true
        });
	},
};