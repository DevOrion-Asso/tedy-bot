const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfos')
		.setDescription('Affiche toutes les informations du bot'),
	async execute(client, interaction, db) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        let uptime = `**${days}** jour(s), **${hours}** heure(s), **${minutes}** minute(s) et **${seconds}** seconde(s)`;

        const développeur = client.users.cache.get('574544938440851466');

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#b83dba')
                    .setTitle(`Informations sur le bot`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true, format: "webp" }))
                    .addFields(
                        [
                            {
                                name: "Client :",
                                value: `> **${client.user.tag}**\n> ${client.user}\n> \`${client.user.id}\``,
                                inline: true
                            },
                            {
                                name: "Structure :",
                                value: `> **Discord.js@${version}**\n> <:slash_command:1095694892111503481> Pris en charge`,
                                inline: true
                            },
                            {
                                name: "** **",
                                value: `** **`,
                            },
                            {
                                name: "Développeur :",
                                value: `> **${développeur.tag}** / [**DevOrion Developer Team**](https://github.com/orgs/DevOrion-Korp/)`,
                                inline: true
                            },
                            {
                                name: "Uptime du bot :",
                                value: `> ${uptime}`,
                            }
                        ]
                    )
            ]
        });
	},
};