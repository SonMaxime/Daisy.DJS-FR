const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pp',
    category: "Commandes d'info",
    aliases: ['icone', 'logo'],
    description: 'Affiche la pp de qui tu veux.',
    usage: '[@user]',
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
        .setImage(message.author.defaultAvatarURL)
        .setColor('#275BF0')
        
        message.channel.send(embed)
    },
};
