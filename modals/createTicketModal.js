const { EmbedBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    id: "createTicketModal",
    run: async (client, interaction, db) => {
        const getObject = interaction.fields.getTextInputValue('object');

        if (!await db.get(`ticket_${interaction.user.id}`)) {
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.id}`,
                type: ChannelType.GuildText,
                parent: client.config.categorieTicket,
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
                        id: client.config.supportTicketRole,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ],
                    },
                ],
            });
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`close_${interaction.user.id}`)
                        .setLabel('Clôturer le ticket')
                        .setStyle(ButtonStyle.Danger)
                )

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
                                value: `**${interaction.member.nickname ?? interaction.user.username}** / ${interaction.user}\n> \`${interaction.user.id}\``,
                                inline: true
                            }
                        ])
                ],
                components: [
                    row
                ]
            }).then(async msg => {
                msg.pin();

                await db.set("rolereact_message", msg.id);

                const collector = msg.channel.createMessageComponentCollector();

                collector.on('collect', async i => {
                    if (i.customId == `close_${interaction.user.id}`) {
                        if (i.user.id !== interaction.user.id) return i.reply({ content: `${client.emoji.no} **Seul le membre ayant créé le ticket peut le clôturer.**`, ephemeral: true });

                        msg.channel.permissionOverwrites.set([
                            {
                                id: interaction.guild.id,
                                deny: [
                                    PermissionsBitField.Flags.ViewChannel
                                ],
                            },
                            {
                                id: interaction.user.id,
                                deny: [
                                    PermissionsBitField.Flags.ViewChannel
                                ],
                            },
                            {
                                id: client.config.supportTicketRole,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel
                                ],
                            },
                        ]);

                        const new_row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`close_${interaction.user.id}`)
                                    .setLabel('Clôturer le ticket')
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                            )
                        
                        msg.edit({ components: [ new_row ] });

                        await db.delete(`ticket_${interaction.user.id}`);
                        await db.delete(`channel_ticket_${msg.channel.id}`);

                        i.reply({ content: `${client.emoji.shield} Ticket clôturé par l'auteur du ticket !` });
                    };
                });
            });

            await db.push(`ticket_${interaction.user.id}`, { channelId: channel.id });
            await db.push(`channel_ticket_${channel.id}`, { author: interaction.user.id });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`${client.emoji.yes} Votre ticket a bien été créé (${channel}) !`)
                ],
                ephemeral: true
            });
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous avez déjà un ticket créé !`)
                ],
                ephemeral: true
            });
        };
    },
};