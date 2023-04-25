const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, version } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Permet de faire des actions pour le bot !')
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('action')
                .setDescription('Effectuer une action sur le bot')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('reload')
                        .setDescription('Permet de recharger une commande')
                        .addStringOption(option =>
                            option
                                .setName('commande-name')
                                .setDescription('Tapez le nom de la commande')
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('down')
                        .setDescription('Permet d\'éteindre le bot'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('close')
                        .setDescription('Permet de mettre en maintenance le bot'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('open')
                        .setDescription('Permet de rouvrir le bot aux membres'))),
	async execute(client, interaction, db) {
        const subcmdgroup = interaction.options.getSubcommandGroup();

        if (subcmdgroup == 'action') {
            const subcmd = interaction.options.getSubcommand();

            if (subcmd == 'reload') {
                if (interaction.user.id !== client.config.ownerBot) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Seul le développeur du bot peut faire cette commande !`)
                    ],
                    ephemeral: true
                });
                
                const commandName = interaction.options.getString('commande-name', true).toLowerCase();
                const command = interaction.client.commands.get(commandName);
        
                if (!command) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`${client.emoji.no} Aucune commande correspond à \`${commandName}\` !`)
                        ],
                        ephemeral: true
                    })
                } else {
                    delete require.cache[require.resolve(`./${command.data.name}.js`)];

                    try {
                        interaction.client.commands.delete(command.data.name);
                        const newCommand = require(`./${command.data.name}.js`);
                        interaction.client.commands.set(newCommand.data.name, newCommand);

                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setDescription(`${client.emoji.yes} La commande \`${newCommand.data.name}\` a bien été rechargé !`)
                            ],
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription(`${client.emoji.no} Une erreur s'est produite lors du rechargement de la commande \`${command.data.name}\` !`)
                                    .addFields(
                                        [
                                            {
                                                name: "> Erreur :",
                                                value: "```diff\n" + `- ${error.message}` + "\n```"
                                            }
                                        ]
                                    )
                            ],
                            ephemeral: true
                        });
                    };
                };
            } else if (subcmd == 'close') {
                if (interaction.user.id !== client.config.ownerBot) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Seul le développeur du bot peut faire cette commande !`)
                    ],
                    ephemeral: true
                });
                
                await db.set("bot_close", true);
    
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Le bot est désormais en maintenance !`)
                    ],
                    ephemeral: true
                });
            } else if (subcmd == 'open') {
                if (interaction.user.id !== client.config.ownerBot) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Seul le développeur du bot peut faire cette commande !`)
                    ],
                    ephemeral: true
                });
                
                await db.delete("bot_close");
    
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Le bot est désormais réouvert au publique !`)
                    ],
                    ephemeral: true
                });
            } else if (subcmd == 'down') {
                if (interaction.user.id !== client.config.ownerBot) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} Seul le développeur du bot peut faire cette commande !`)
                    ],
                    ephemeral: true
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${client.emoji.yes} Vous avez éteins le bot !`)
                    ],
                    ephemeral: true
                });
    
                process.exit();
            };
        };
	},
};