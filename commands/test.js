const { SlashCommandBuilder, Events, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Faire des test !')
        .addStringOption(option =>
            option.setName('select-event')
                .setDescription('Choisissez l\'évènement à lancer !')
                .setRequired(true)
                .addChoices(
                    { name: 'guildMemberAdd', value: 'guildmemberadd' },
                    { name: 'guildMemberRemove', value: 'guildmemberremove' },
                )),
	async execute(client, interaction, db) {
		const event = interaction.options.getString("select-event");

		if (interaction.user.id !== "574544938440851466") return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Red')
					.setDescription(`${client.emoji.no} Vous devez être le développeur du bot pour faire cette commande !`)
			],
			ephemeral: true
		})

		if (event == "guildmemberadd") {
			client.emit(Events.GuildMemberAdd, interaction.member);

			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Green')
						.setDescription(`${client.emoji.yes} Lancement de \`${event}\` réussi !`)
				],
				ephemeral: true
			});
		} else if (event == "guildmemberremove") {
			client.emit(Events.GuildMemberRemove, interaction.member);

			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Green')
						.setDescription(`${client.emoji.yes} Lancement de \`${event}\` réussi !`)
				],
				ephemeral: true
			});
		}
	},
};
