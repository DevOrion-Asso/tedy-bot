const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Permet gérer les suggestions ou d\'en créer une !')
        .addSubcommandGroup(subcommandGroup =>
          subcommandGroup
            .setName('action')
            .setDescription('Choisissez une action avec les suggestions !')
            .addSubcommand(subcommand =>
              subcommand
                .setName('create')
                .setDescription('Get information about a user')
                .addStringOption(option =>
                    option
                        .setName('content')
                        .setDescription('Explique ta suggestion !')
                        .setMaxLength(1024)
                        .setMinLength(10)
                        .setRequired(true)))
            .addSubcommand(subcommand =>
              subcommand
                .setName('valid')
                .setDescription('Get information about the server')
                .addStringOption(option =>
                    option
                        .setName('suggest-id')
                        .setDescription('Définissez l\'identifiant de la suggestion !')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('comment')
                        .setDescription('Donnez la raison de la validation de la suggestion !')))
            .addSubcommand(subcommand =>
              subcommand
                .setName('invalid')
                .setDescription('Permet de refuser une suggestion !')
                .addStringOption(option =>
                    option
                        .setName('suggest-id')
                        .setDescription('Définissez l\'identifiant de la suggestion !')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('comment')
                        .setDescription('Donnez la raison de la validation de la suggestion !')))),
	async execute(client, interaction, db) {
        const sub = interaction.options.getSubcommand();

        if (sub == "create") {
            const id = Math.floor(Math.random() * (999999 - 300 + 1)) + 300;

            const content = interaction.options.getString('content');

            const suggestChannel = interaction.guild.channels.cache.find(channel => channel.id == "1099778385988816947");

            const embedSuggest = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`Suggestion de ${interaction.user.tag} [\`${id}\`]`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))
                .addFields(
                    [
                        {
                            name: `${client.emoji.shield} Suggestion :`,
                            value: `${content}`
                        },
                        {
                            name: `${client.emoji.purplecercle} Réponse :`,
                            value: "En attente"
                        }
                    ]
                )

            if (suggestChannel) suggestChannel.send({
                embeds: [
                    embedSuggest
                ]
            })
            .then(async msg => {
                await db.set(`suggest_${id}`, {
                    id: id,
                    author: interaction.user.id,
                    avatar: interaction.user.avatarURL({ dynamic: true, format: "webp" }),
                    content: content,
                    message: msg.id
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Votre suggestion a bien été envoyé ! [\`${id}\`]`)
                    ],
                    ephemeral: true
                });
            })
            .catch(error => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Une erreur est survenue...`)
                            .addFields(
                                [
                                    {
                                        name: "> Erreur :",
                                        value: "```diff\n" + `- ${error}` + "\n````"
                                    }
                                ]
                            )
                    ],
                    ephemeral: true
                });
            });
        } else if (sub == "valid") {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Il vous faut la permission \`${PermissionFlagsBits.ManageMessages}\` pour faire cette commande !`)
                ],
                ephemeral: true
            });

            const id = interaction.options.getString("id");
            const comment = interaction.options.getString('comment') ?? "Aucun commentaire fournis.";

            if (!db.get(`suggest_${id}`)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Aucune suggestion trouvé avec l'id \`${id}\` !`)
                ],
                ephemeral: true
            });

            const data = {
                author: db.get(`suggest_${id}.author`),
                authorAvatarURL: db.get(`suggest_${id}.avatar`),
                content: db.get(`suggest_${id}.content`),
                message: db.get(`suggest_${id}.message`)
            };

            const auteur = client.users.cache.get(data.author);

            client.channels.cache.get("1099778385988816947").messages.fetch(data.message).then(message => {
                message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`Suggestion de ${auteur} !`)
                            //.setThumbnail(data.authorAvatarURL)
                            .addFields(
                                [
                                    {
                                        name: `${client.emoji.shield} Suggestion :`,
                                        value: `${data.content}`
                                    },
                                    {
                                        name: `${client.emoji.yes} Suggestion approuvé !`,
                                        value: `${comment}`
                                    }
                                ]
                            )
                            .setFooter({ text: `Suggestion validé par ${interaction.member.nickname ?? interaction.user.tag} !` })
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Réponse envoyé avec succès !`)
                    ],
                    ephemeral: true
                });
            });
        } else if (sub == "invalid") {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Il vous faut la permission \`${PermissionFlagsBits.ManageMessages}\` pour faire cette commande !`)
                ],
                ephemeral: true
            });

            const id = interaction.options.getString("id");
            const comment = interaction.options.getString('comment') ?? "Aucun commentaire fournis.";

            if (!db.get(`suggest_${id}`)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Aucune suggestion trouvé avec l'id \`${id}\` !`)
                ],
                ephemeral: true
            });

            const data = {
                author: db.get(`suggest_${id}.author`),
                authorAvatarURL: db.get(`suggest_${id}.avatar`),
                content: db.get(`suggest_${id}.content`),
                message: db.get(`suggest_${id}.message`)
            };

            const auteur = client.users.cache.get(data.author);

            client.channels.cache.get("1099778385988816947").messages.fetch(data.message).then(message => {
                message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`Suggestion de ${auteur} !`)
                            //.setThumbnail(data.authorAvatarURL)
                            .addFields(
                                [
                                    {
                                        name: `${client.emoji.shield} Suggestion :`,
                                        value: `${data.content}`
                                    },
                                    {
                                        name: `${client.emoji.no} Suggestion non approuvé !`,
                                        value: `${comment}`
                                    }
                                ]
                            )
                            .setFooter({ text: `Suggestion refusé par ${interaction.member.nickname ?? interaction.user.tag} !` })
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Réponse envoyé avec succès !`)
                    ],
                    ephemeral: true
                });
            });
        };
	},
};