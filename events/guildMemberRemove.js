const { Events, EmbedBuilder } = require('discord.js');

const colors = require("colors/safe");

const config = require("../data/config");

module.exports = {
	name: Events.GuildMemberAdd,
	once: true,
	async execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === 'id_salon_au_revoir');

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:arrow:1097959138807521280> Au revoir **${member.user.tag}** et à bientôt !`)
                    .setFooter({ text: `Nous sommes désormais ${member.guild.memberCount} membres !` })
                    .setImage('https://cdn.discordapp.com/attachments/914271938359210045/1098785367945121893/banner.png')
            ]
        });

        member.roles.add('998366139946115162').catch(error => {});
    },
};
