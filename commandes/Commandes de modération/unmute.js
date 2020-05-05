const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "unmute",
    category: "Commandes de modération",
    description: "Unmute un membre",
    run: async(client, message, args) => {
        let user = message.guild.member(message.mentions.users.first());
        let muteRole = message.guild.roles.cache.find(r => r.name === 'Muté');
        let unmuteRole = message.guild.roles.cache.find(r => r.name === 'les twittos');
        
        user.roles.remove(muteRole.id);
        user.roles.add(unmuteRole.id);
        message.channel.send(`<@${user.id}> n'est plus mute.`);

        const embed = new MessageEmbed()
        .setAuthor(`${user.user.username} (${user.id})`, user.user.avatarURL())
        .setColor("#ffa500")
        .setDescription(`**Action**: unmute`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());

        client.channels.cache.get('694840832926154752').send(embed)
    
    }
}