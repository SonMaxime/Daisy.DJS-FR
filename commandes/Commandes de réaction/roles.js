const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roles',
    description: 'Envoie un embed avec tous les rôles disponibles',
    usage: 'reaction émoji',
    run: async (client, message, args) => {
        const notifs = message.guild.emojis.cahce.get("709366172205842493")
        const roleNotifs = message.guild.roles.cache.get("709361899132813353");
        const twitter = message.guild.emojis.cahce.get("704329126466551818")
        const twitterRole = message.guild.roles.cache.get("709368093939335330")

        const embed = new MessageEmbed()
        .setTitle('Rôles')
        .setDescription("Cliquez sur une des réactions ci-dessous pour obtenir le rôle correspondant.")
        .addField(
            "Les rôles disponibles:",
            `
            ${notifs} - ${roleNotifs.toString()}
            ${twitter} - ${twitterRole.toString()}
            `
          );
        
        client.channels.cache.get('709361522891292763').send(embed).then(async msg => {
            await msg.react(notifs);
            await msg.react(twitter);
        })
    }
}