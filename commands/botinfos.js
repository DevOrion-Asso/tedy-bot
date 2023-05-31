const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfos')
		.setDescription('Affiche toutes les informations du bot'),
	async execute(client, interaction, db) {
        const mesg = await interaction.deferReply({ content: ":gear: Chargement...", fetchReply: true });
		
        await wait(1000);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        let uptime = `**${days}** jour(s), **${hours}** heure(s), **${minutes}** minute(s) et **${seconds}** seconde(s)`;

        const développeur = client.users.cache.get('574544938440851466');

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#b83dba')
                    .setTitle(`Informations sur le bot`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true, format: "webp" }))
                    .addFields(
                        [
                            {
                                name: "<:purple_cercle:1099378807380648036>Client :",
                                value: `> **${client.user.tag}**\n> ${client.user}\n> \`${client.user.id}\``,
                                inline: true
                            },
                            {
                                name: "<:purple_cercle:1099378807380648036>Structure :",
                                value: `> **Discord.js@${version}**\n> <:slash_command:1095694892111503481> Pris en charge`,
                                inline: true
                            },
                            {
                                name: "** **",
                                value: `** **`,
                            },
                            {
                                name: "<:purple_cercle:1099378807380648036>Développeur :",
                                value: `> **${développeur.tag}** / [**DevOrion Developer Team**](https://github.com/orgs/DevOrion-Asso/)`,
                                inline: true
                            },
                            {
                                name: "<:purple_cercle:1099378807380648036>Uptime du bot :",
                                value: `> ${uptime}`,
                            },
                            {
                                name: "<:purple_cercle:1099378807380648036>Hébergeur :",
                                value: '> [HostyCord](https://hostycord.com/)',
                                inline: true
                            },
                            {
                                name: "<:purple_cercle:1099378807380648036>Latence",
                                value: `> **Latence API :** \`${client.ws.ping} ms\`\n> **Latence bot :** \`${mesg.createdTimestamp - interaction.createdTimestamp} ms\``,
                                inline: true
                            }
                        ]
                    )
                    .setFooter({ text: `Par l'équipe de DevOrion` })
            ]
        });
	},
};
