const { Events, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const colors = require("colors/safe");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(c) {
        console.log(colors.blue('[INFO]') + " " + colors.red(`Log In on ${c.user.username} !`));

		c.user.setPresence({
			activities: [
				{
					name: 'vous aider !'
				}
			]
		});

		// MESSAGE INFORMATION
		//const channelInfo = c.guilds.cache.get('998363750862168184').channels.cache.find(channel => channel.id === '1098777615936012380');

		const embedInfo = new EmbedBuilder()
			.setColor('#b83dba')
			.setTitle("Information sur __DevOrion__")
			.setThumbnail('https://cdn.discordapp.com/attachments/914271938359210045/980928769588072478/LOGO-DEVORION-1.png')
			.setDescription(`${c.emoji.purplecercle} **DevOrion** est en procédure pour devenir une **association** !`)
			.addFields([
				{
					name: "Bienvenue chez DevOrion,",
					value: `Un groupe de développeurs dévoués qui travaillent sur la création de petits projets informatiques, fournissant aussi une assistance pour les particuliers.
${c.emoji.arrow} En tant qu'équipe de développeurs, nous sommes engagés à créer des projets innovants qui **répondent parfaitement à vos besoins.** Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs besoins et créer une solution adaptée.
${c.emoji.arrow}  DevOrion offre une **gamme complète de services informatiques**, allant de la création de petits projets personnalisés à l'assistance informatique complète pour les particulier.
${c.emoji.arrow}  Notre objectif est l'excellence, et nous sommes fiers de notre **expertise technique** mise à votre service !`
				},
				{
					name: "Maintenant, des __éventuelles questions__ :",
					value: `**Q1: Est-ce que vos services sont gratuits ?**
Effectivement, nos prestations sont entièrement **gratuites et bénévoles.** 
					
**Q2: Quels besoins pouvez-vous satisfaire ?**
Nous sommes en mesure de répondre à une variété de besoins, par exemple :
${c.emoji.purplecercle} Compléter une partie de votre bot Discord que vous jugez trop difficile...
${c.emoji.purplecercle}  Développer un site internet répondant à vos envies.
${c.emoji.purplecercle}  Fournir une assistance avec des logiciels ou des appareils informatiques : crashes, interrogations... 
> Ce ne sont que des exemples, notre démarche est de s'adapter à nos cs, en leur proposant un service personnalisé.`
				},
				{
					name: ":information_source: __**Important:**__",
					value: `Nous recherchons des personnes motivées pour rejoindre notre équipe ! Si vous êtes intéressé, contactez moi !


Merci de votre attention. Nous sommes impatients de travailler avec vous et de vous aider à tirer le meilleur parti de la technologie ${c.emoji.tedyWink}


*Voici notre __direction artistique__ :*`
				}
			])
			.setImage('https://cdn.discordapp.com/attachments/1098308533952458762/1099336283454701609/DA-DevOrion.png')
		/*if (channelInfo) channelInfo.send({
			embeds: [
				embedInfo
			]
		});*/
    },
};