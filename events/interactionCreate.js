const { Events, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const colors = require("colors/safe");

const { BotClose } = require("../data/config");

const client = require("../main");

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
                if (BotClose == true && interaction.user.id !== "id_owner_bot") {
                    await interaction.deferReply({ ephemeral: true });
                    await wait(2000);
    
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(':x: Bot blocked, only developer can use the bot !')
                        ],
                        ephemeral: true
                    })
                } else {
                    await command.execute(client, interaction);
                };
            } catch (error) {
                console.log(colors.magenta('[ERROR]') + "\n" + colors.red(error));
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`:x: An error occurred while running the command \`${interaction.commandName}\` !`)
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
                  .setDescription('Something went wrong... Probably the Modal ID is not defined in the modals handler.')
                  .setColor('Red')
              ],
              ephemeral: true
            });
        
            try {
              modal.run(client, interaction);
            } catch (e) {
              console.error(e)
            };
        }
	},
};
