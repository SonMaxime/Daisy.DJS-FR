const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "quiest",
    aliases: ["qe"],
    category: "Commandes d'info",
    description: "Renvoie les informations d'un membre",
    usage: "[pseudo | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Informations du membre:', stripIndents`**- Nom D'affichage :** ${member.displayName}
            **- Rejoint le:** ${joined}
            **- Roles:** ${roles}`, true)

            .addField("Informations de l'utilisateur:", stripIndents`**- ID:** ${member.user.id}
            **- Pseudo**: ${member.user.username}
            **- Tag**: ${member.user.tag}
            **- Crée le**: ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('En train de jouer', stripIndents`** Nom:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}
