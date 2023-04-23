const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open-ticket')
		.setDescription('Vous permet d\'ouvrir un ticket sur le Discord !'),
	async execute(client, interaction, db) {
        const modal = new ModalBuilder()
            .setCustomId(`createTicketModal`)
            .setTitle('Créer un ticket');

        const something = new TextInputBuilder()
            .setCustomId(`object`)
            .setLabel("Objet de votre ticket ici")
            .setStyle(TextInputStyle.Short);

        const ActionRow = new ActionRowBuilder().addComponents(something);

        modal.addComponents(ActionRow);

        await interaction.showModal(modal);
	},
};