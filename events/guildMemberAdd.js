const { Events, EmbedBuilder } = require('discord.js');

const colors = require("colors/safe");

const config = require("../data/config");

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === 'id_salon_bienvenue');

        member.roles.add('id_role_membre').catch(error => {});

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(`<:arrow:1097959138807521280> Bienvenue ${member} !\n> Vas regarder <#1098777615936012380> <:TedyWink:998366976881737748>`)
                    .setFooter({ text: `Nous sommes désormais ${member.guild.memberCount} membres !` })
                    .setImage('https://cdn.discordapp.com/attachments/914271938359210045/1098785367945121893/banner.png')
            ]
        });
    },
};
