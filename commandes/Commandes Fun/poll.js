const Discord = require('discord.js');

module.exports = {
    name: "poll",
    category: "Commandes Fun",
    description: "Crée un sondage.",
    run: async (client, message, args) => {
        let user = message.mentions.users.first() || message.author
    if (!message.guild.member(client.user).hasPermission('ADD_REACTIONS')) return message.reply('Désolé, je n\'ai pas les permissions (ADD_REACTIONS). :x:')
        const sayMessage = args.join(" ");
       if (sayMessage.length < 1) return message.channel.send("Veullez provenir un sondage.")
       if (message.member.hasPermission("KICK_MEMBERS")) {
         const embed = new Discord.RichEmbed()
         .setColor(0x00A2E8)
         .setFooter(message.guild.name, message.guild.iconURL)
         .setTimestamp()
         .setTitle("**SONDAGE**")
         .setDescription(`Un sondage a fait surface ! : "**${sayMessage}**", votez maintenant!`)
          message.channel.send(embed).then(m => {
              m.react('✅');
              m.react('❌');
             })
        }
    }
}