const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, version } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Permet de faire des actions pour le bot !')
        .addStringOption(option =>
            option.setName('select-action')
                .setDescription('Choisissez ce que vous voulez faire !')
                .setRequired(true)
                .addChoices(
                    { name: 'infos', value: 'infos' },
                    { name: 'down', value: 'down' },
                    { name: 'close', value: 'close' },
                    { name: 'open', value: 'open' }
                )),
	async execute(client, interaction, db) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${client.config.emojiNo} Vous devez avoir la permission \`Administrator\` pour faire cette commande !`)
            ],
            ephemeral: true
        });

        const option = interaction.options.getString('select-action');

        if (option == "infos") {
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
                                    value: `> ${développeur} / [**DevOrion Developer Team**](https://github.com/orgs/DevOrion-Korp/teams/equipe-developpement)`,
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
        } else if (option == "close") {
            await db.set("bot_close", true);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`${client.config.emojiYes} Le bot est désormais en maintenance !`)
                ],
                ephemeral: true
            });
        } else if (option == "open") {
            await db.delete("bot_close");

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`${client.config.emojiYes} Le bot est désormais réouvert au publique !`)
                ],
                ephemeral: true
            });
        } else if (option == "down") {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`${client.config.emojiYes} Vous avez éteins le bot !`)
                ],
                ephemeral: true
            });

            process.exit();
        };
	},
};
