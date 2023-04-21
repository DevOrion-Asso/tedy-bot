const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { exec } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-bot')
		.setDescription('Permet de lancer les bots host chez nous !')
        .addStringOption(option =>
            option.setName('select-bot')
                .setDescription('Choisissez votre bot !')
                .setRequired(true)
                .addChoices(
                    { name: 'FRAnime', value: 'franime' },
                )),
	async execute(client, interaction) {
        const bot = interaction.options.getString("select-bot");

        let redirect;

        if (bot == "franime") redirect = "C:\\Users\\vallo\\OneDrive\\Documents\\start-discord-bot-Version-001\\main.js";

        exec(`node ${redirect}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur : ${error}`);
                return;
            }
            console.log(`stdout : ${stdout}`);
            console.error(`stderr : ${stderr}`);
        });

        interaction.reply({
            content: `Bot \`${bot}\` lancé !`,
            ephemeral: true
        })
	},
};
