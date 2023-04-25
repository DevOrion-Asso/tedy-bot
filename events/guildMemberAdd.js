const { Events, EmbedBuilder } = require('discord.js');

const colors = require("colors/safe");

const config = require("../data/config");

const client = require("../main");

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === '998374421800689735');

        member.roles.add('998366139946115162').catch(error => {});

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(`${client.emoji.wave} Bienvenue ${member} !\n> Vas regarder <#1098777615936012380> ${client.emoji.tedyWink}`)
                    .setFooter({ text: `Nous sommes désormais ${member.guild.memberCount} membres !` })
                    .setImage('https://cdn.discordapp.com/attachments/914271938359210045/1098785367945121893/banner.png')
            ]
        });
    },
};