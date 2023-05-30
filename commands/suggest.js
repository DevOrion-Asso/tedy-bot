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
                        .setDescription('Donnez la raison de la validation de la suggestion !')
                        .setRequired(true)))
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
                        .setDescription('Donnez la raison de la validation de la suggestion !')
                        .setRequired(true)))),
	async execute(client, interaction, db) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'create':    
                const id = Math.floor(Math.random() * (999999 - 300 + 1)) + 300;
                const content = interaction.options.getString('content');
    
                const suggestChannel = interaction.guild.channels.cache.find(channel => channel.id == client.config.suggestChannel);
    
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
                break;

            case 'valid':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Il vous faut la permission \`${PermissionFlagsBits.ManageMessages}\` pour faire cette commande !`)
                    ],
                    ephemeral: true
                });
    
                const id_valid = interaction.options.getString("suggest-id");
                const comment_valid = interaction.options.getString('comment') ?? "Aucun commentaire fournis.";
    
                if (!await db.get(`suggest_${id_valid}`)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Aucune suggestion trouvé avec l'id \`${id_valid}\` !`)
                    ],
                    ephemeral: true
                });
    
                const data_valid = {
                    author: await db.get(`suggest_${id_valid}.author`),
                    authorAvatarURL: await db.get(`suggest_${id_valid}.avatar`),
                    content: await db.get(`suggest_${id_valid}.content`),
                    message: await db.get(`suggest_${id_valid}.message`)
                };
    
                //console.log(data.message);
    
                const auteur_valid = client.users.cache.get(data_valid.author);
    
                client.channels.cache.get(client.config.suggestChannel).messages.fetch(data_valid.message).then(message => {
                    message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setDescription(`Suggestion de ${auteur_valid} !`)
                                .setThumbnail(data_valid.authorAvatarURL)
                                .addFields(
                                    [
                                        {
                                            name: `${client.emoji.shield} Suggestion :`,
                                            value: `${data_valid.content}`
                                        },
                                        {
                                            name: `${client.emoji.yes} Suggestion approuvé !`,
                                            value: `${comment_valid}`
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
                break;
            case 'invalid':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Il vous faut la permission \`${PermissionFlagsBits.ManageMessages}\` pour faire cette commande !`)
                    ],
                    ephemeral: true
                });
    
                const id_invalid = interaction.options.getString("suggest-id");
                const comment_invalid = interaction.options.getString('comment') ?? "Aucun commentaire fournis.";
    
                if (!await db.get(`suggest_${id_invalid}`)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Aucune suggestion trouvé avec l'id \`${id_invalid}\` !`)
                    ],
                    ephemeral: true
                });
    
                const data_invalid = {
                    author: await db.get(`suggest_${id_invalid}.author`),
                    authorAvatarURL: await db.get(`suggest_${id_invalid}.avatar`),
                    content: await db.get(`suggest_${id_invalid}.content`),
                    message: await db.get(`suggest_${id_invalid}.message`)
                };
    
                //console.log(data.message);
    
                const auteur_invalid = client.users.cache.get(data_invalid.author);
    
                client.channels.cache.get(client.config.suggestChannel).messages.fetch(data_invalid.message).then(message => {
                    message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`Suggestion de ${auteur_invalid} !`)
                                .setThumbnail(data_invalid.authorAvatarURL)
                                .addFields(
                                    [
                                        {
                                            name: `${client.emoji.shield} Suggestion :`,
                                            value: `${data_invalid.content}`
                                        },
                                        {
                                            name: `${client.emoji.no} Suggestion non approuvé !`,
                                            value: `${comment_invalid}`
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
                break;
            default:
                break;
        }
	},
};
