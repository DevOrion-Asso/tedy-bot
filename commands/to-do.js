const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

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
                .setDescription('Permet de refuser une suggestion !')
                .addStringOption(option =>
                    option
                        .setName('task-id')
                        .setDescription('Définissez l\'identifiant de la tâche !')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('new-content')
                        .setDescription('Définissez le nouveau contenue de la tâche !')))),
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

        if (subcmd == 'create') {
            if (await !db.get(`todo_${interaction.guild.id}_${interaction.user.id}`)) return interaction.reply({
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
            const new_task = interaction.options.getString('content');
            const id = Math.floor(Math.random() * (999999 - 300 + 1)) + 300;

            await db.push(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`, {
                id: id,
                content: new_task,
                statut: false
            });

            console.log(await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks));

            const data = {
                channelid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.channel_embed_id`),
                messageid: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.message_embed_id`),
                tasks: await db.get(`todo_${interaction.guild.id}_${interaction.user.id}.tasks`)
            };

            client.channels.cache.get(data.channelid).messages.fetch(data.messageid).then(message => {
                const new_embed = new EmbedBuilder()
                    .setColor('Orange')
                        .setTitle(`Tâche de ${interaction.user.tag}`)
                        .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp" }))
                
                for (let i = 0; i < data.tasks.lenght; i++) {
                    let statut;
                    if (data.tasks[i].statut == false) {
                        statut = client.emoji.no;
                    } else {
                        statut = client.emoji.yes;
                    };

                    new_embed.addFields(
                        [
                            {
                                name: `> ${statut} Tâche id \`${data.tasks[i].id}\` :`,
                                value: `${data.tasks[i].content}`
                            }
                        ]
                    )
                };

                message.edit({
                    embeds: [
                        new_embed
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
        };
	},
};
