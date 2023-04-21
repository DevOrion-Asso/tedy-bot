const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "testModal",
    run: async (client, interaction) => {

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('test de modal')
            ],
            ephemeral: true
        });
    },
};
