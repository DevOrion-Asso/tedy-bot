const { Events, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const colors = require("colors/safe");

const { BotClose } = require("../data/config");

const client = require("../main");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
        
            if (!command) {
                console.error(`No order match ${interaction.commandName} was found.`);
                return;
            }
        
            try {
                if (db.get('bot_close') == true && interaction.user.id !== "574544938440851466") {
                    await interaction.deferReply({ ephemeral: true });
                    await wait(2000);
    
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`${client.emoji.no} Bot accessible seulement au développeur !\n> *Bot en maintenance...<:TedyGene:998366963606765589>*`)
                        ],
                        ephemeral: true
                    })
                } else {
                    await command.execute(client, interaction, db);
                };
            } catch (error) {
                console.log(colors.magenta('[ERROR]') + "\n" + colors.red(error));
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${client.emoji.no} An error occurred while running the command \`${interaction.commandName}\` !`)
                            .addFields([
                                {
                                    name: "> Error :",
                                    value: "```diff\n- " + error + "```"
                                }
                            ])
                    ],
                    ephemeral: true
                });
            }
        };

        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
        
            if (!modal) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.no} Une erreur est survenue lors du lancement du **modal** !`)
                ],
                ephemeral: true
            });
        
            try {
                modal.run(client, interaction, db);
            } catch (e) {
                console.error(e)
            };
        }
	},
};
