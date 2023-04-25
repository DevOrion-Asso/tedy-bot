const { Events, EmbedBuilder } = require('discord.js');

const colors = require("colors/safe");

const config = require("../data/config");

const client = require("../main");

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === '998374421800689735');

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${client.emoji.arrow} Au revoir **${member.user.tag}** et à bientôt !`)
                    .setFooter({ text: `Nous sommes désormais ${member.guild.memberCount} membres !` })
                    .setImage('https://cdn.discordapp.com/attachments/914271938359210045/1098785367945121893/banner.png')
            ]
        });
    },
};