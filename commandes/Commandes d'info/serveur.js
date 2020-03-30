const Discord = require('discord.js');

module.exports = {
    name: 'serveur',
    category: "Commandes d'info",
    description: 'Affiche les informations du serveur.',
    run: async (client, message, args) => {
        if (!message.guild.members.has(message.guild.ownerID)) await message.guild.members.fetch(message.guild.ownerID);
        const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTitle('Server Info')
      .setThumbnail(message.guild.iconURL)
      .addField(':arrow_right: Nom :', message.guild.name, true)
      .addField(':arrow_right: ID :', message.guild.id, true)
      .addField(':arrow_right: Région :', message.guild.region.toUpperCase(), true)
      .addField(':arrow_right: Date de création :', message.guild.createdAt.toDateString(), true)
      .addField(':arrow_right: Créateur :', message.guild.owner.user.tag, true)
      .addField(':arrow_right: Nombre de membres :', message.guild.memberCount, true)
      .addField(':arrow_right: Roles :', message.guild.roles.map(role => role.toString()).join(' **|** '), true)
      .addField(':arrow_right: Categories :', message.guild.channels.filter(channel => channel.type === 'category').map(category => category.toString()).join(' **|** '), true)
      .addField(':arrow_right: Salons :', message.guild.channels.filter(channel => channel.type !== 'category').map(channel => channel.toString()).join(' **|** '), true);
        
        return message.channel.send(embed);
    },
};
