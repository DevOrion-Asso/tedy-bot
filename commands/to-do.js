const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const { addFieldsEmbed } = require("../data/functions");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('to-do')
		.setDescription('Permet de faire une liste de tâche !')
        .addSubcommandGroup(subcommandGroup =>
          subcommandGroup
            .setName('action')
            .setDescription('Choisissez une action avec le to do list !')
            .addSubcommand(subcommand =>
              subcommand
                .setName('create')
                .setDescription('Configure ton embed pour voir la liste !'))
            .addSubcommand(subcommand =>
              subcommand
                .setName('add')
                .setDescription('Ajoutez une tâche !')
                .addStringOption(option =>
                    option
                        .setName('content')
                        .setDescription('Définissez le contenue de la tâche !')
                        .setRequired(true)))
            .addSubcommand(subcommand =>
              subcommand
                .setName('delete')
                .setDescription('Supprimez une tâche')
                .addStringOption(option =>
                    option
                        .setName('task-id')
                        .setDescription('Définissez l\'identifiant de la tâche !')
                        .setRequired(true)))
            .addSubcommand(subcommand =>
              subcommand
                .setName('edit')
                .setDescription('Valider une tâche !')
                .addStringOption(option =>
                    option
                        .setName('task-id')
                        .setDescription('Définissez l\'identifiant de la tâche !')
                        .setRequired(true)))),
	async execute(client, interaction, db) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${client.emoji.no} Il vous faut la permission \`${PermissionFlagsBits.Administrator}\` pour faire cette commande !`)
            ],
            ephemeral: true
        });

        const subcmd = interaction.options.getSubcommand();

        const userdbtodo = await db.get(`todo_${interaction.guild.id}_${interaction.user.id}`);
        const list = await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`);

        if (subcmd == 'create') {
            if (userdbtodo) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous avez déjà un to-do-list !`)
                ],
                ephemeral: true
            });

            interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Orange')
                        .setTitle(`Tâche de ${interaction.user.tag}`)
                        .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))
                        .setDescription(`Aucune tâche pour le moment`)
                ]
            }).then(async msg => {
                await db.set(`todo_${interaction.guild.id}_${interaction.user.id}`, {
                    message_embed_id: msg.id,
                    channel_embed_id: msg.channel.id,
                    tasks: []
                });

                msg.pin();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} To Do List configuré !`)
                    ],
                    ephemeral: true
                });
            });
        } else if (subcmd == 'add') {
            if (!userdbtodo) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous n'avez pas configuré votre ebed !\n> \`/to-do action create\``)
                ],
                ephemeral: true
            });
            
            const new_task = interaction.options.getString('content');
            const id = Math.floor(Math.random() * (999999 - 300 + 1)) + 300;

            if (list.length == 25) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous avez la limite de **25 tâche** !`)
                ],
                ephemeral: true
            });

            await db.push(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`, {
                id: id,
                content: new_task,
                statut: false
            });

            const new_list = await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`);

            const data = {
                channelid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.channel_embed_id`),
                messageid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.message_embed_id`),
            };

            const embed = new EmbedBuilder()
                .setColor(0xb83dba)
                .setTitle(`Tâche de ${interaction.user.tag}`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))

            addFieldsEmbed(client, new_list, embed);

            client.channels.cache.get(data.channelid).messages.fetch(data.messageid).then(message => {
                message.edit({
                    embeds: [
                        embed
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Tâche bien ajouté !`)
                    ],
                    ephemeral: true
                });
            });
        } else if (subcmd == 'edit') {
            const task_id = parseInt(interaction.options.getString('task-id'));

            if (!userdbtodo) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous n'avez pas configuré votre ebed !\n> \`/to-do action create\``)
                ],
                ephemeral: true
            });

            if (list.length < 1) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous n'avez pas de tâche !\n> \`/to-do action add\``)
                ],
                ephemeral: true
            });

            let object = list.find(object => object.id === task_id);

            if (!object) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} L'ID \`${task_id}\` correspond à aucune tâche !`)
                ],
                ephemeral: true
            });

            if (object) {
                object.statut = true;
            };

            await db.set(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`, list);

            const new_list = await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`);

            const data = {
                channelid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.channel_embed_id`),
                messageid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.message_embed_id`),
            };

            const new_embed = new EmbedBuilder()
                .setColor(0xb83dba)
                .setTitle(`Tâche de ${interaction.user.tag}`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))

            addFieldsEmbed(client, new_list, new_embed);

            client.channels.cache.get(data.channelid).messages.fetch(data.messageid).then(message => {
                message.edit({
                    embeds: [
                        new_embed
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Tâche bien modifié !`)
                    ],
                    ephemeral: true
                });
            });
        } else if (subcmd == 'delete') {
            const task_id = parseInt(interaction.options.getString('task-id'));

            if (!userdbtodo) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous n'avez pas configuré votre ebed !\n> \`/to-do action create\``)
                ],
                ephemeral: true
            });

            if (list.length < 1) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Vous n'avez pas de tâche !\n> \`/to-do action add\``)
                ],
                ephemeral: true
            });

            let object = list.find(object => object.id === task_id);

            if (!object) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} L'ID \`${task_id}\` correspond à aucune tâche !`)
                ],
                ephemeral: true
            });

            let index = list.findIndex(objet => objet.id === task_id);

            if (index !== -1) {
                list.splice(index, 1);
            };

            await db.set(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`, list);

            const new_list = await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`);

            const data = {
                channelid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.channel_embed_id`),
                messageid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.message_embed_id`),
            };

            const new_embed = new EmbedBuilder()
                .setColor(0xb83dba)
                .setTitle(`Tâche de ${interaction.user.tag}`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))

            addFieldsEmbed(client, new_list, new_embed);

            client.channels.cache.get(data.channelid).messages.fetch(data.messageid).then(message => {
                message.edit({
                    embeds: [
                        new_embed
                    ]
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Tâche bien supprimé !`)
                    ],
                    ephemeral: true
                });
            });
        };
	},
};