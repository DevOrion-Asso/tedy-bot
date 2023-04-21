const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-bot')
		.setDescription('Permet de mettre en maintenance le bot !'),
	async execute(client, interaction, db) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${client.config.emojiNo} Vous devez avoir la permission \`Administrator\` pour faire cette commande !`)
            ],
            ephemeral: true
        });

        await db.set("bot_close", true);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`${client.config.emojiYes} Le bot est désormais en maintenance !`)
            ],
            ephemeral: true
        });
	},
};