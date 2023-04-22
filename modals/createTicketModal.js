const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
    id: "createTicketModal",
    run: async (client, interaction, db) => {
        const getObject = interaction.fields.getTextInputValue('object');

        if (!await db.get(`ticket_${interaction.user.id}`)) {
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.id}`,
                type: ChannelType.GuildText,
                parent: "id_categorie",
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel
                        ],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ],
                    },
                    {
                        id: "role_support_id",
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ],
                    },
                ],
            });

            channel.send({
                content: `<@&1099159524813832243>`,
                embeds: [
                    new EmbedBuilder()
                        .setColor('#962798')
                        .setTitle('Nouveau ticket !')
                        .setThumbnail(interaction.user.avatarURL({ dynmaic: true, format: "webp" }))
                        .addFields([
                            {
                                name: `Objet du ticket :`,
                                value: `${getObject}`,
                                inline: true
                            },
                            {
                                name: "Auteur du ticket :",
                                value: `**${interaction.member.nickname ?? interaction.user.username}** / ${interaction.user}\n> \`${interaction.user.id}\``
                            }
                        ])
                ]
            });

            await db.push(`ticket_${interaction.user.id}`, { channelId: channel.id });
            await db.push(`channel_ticket_${channel.id}`, { author: interaction.user.id });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`${client.config.emojiYes} Votre ticket a bien été créé (${channel}) !`)
                ],
                ephemeral: true
            });
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.config.emojiNo} Vous avez déjà un ticket créé ! (<#${db.get(`ticket_${interaction.user.id}.channelId`)})`)
                ],
                ephemeral: true
            });
        };
    },
};
