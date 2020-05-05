const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "Commandes de modération",
    description: "Reporter un membre (ADMIN ONLY)",
    usage: "<mention / id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!rMember)
            return message.reply("Je ne trouve pas cette personne, réessayer.").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Je ne peux pas report ce membre.").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Veuillez provenir une raison a votre report.").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "reports")
            
        if (!channel)
            return message.channel.send("Je ne trouve pas le salon `#reports`.").then(m => m.delete(5000));

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Page de rapport du membre suivant :", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**- Membre:** ${rMember} (${rMember.user.id})
            **- Report par:** ${message.member}
            **- Report dans:** ${message.channel}
            **- Acte réalisé :** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}
