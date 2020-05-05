const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "mute",
    category: "Commandes de modération",
    description: "Mute un membre",
    usage: "<id | temps>",
    run: async(client, message, args) => {

    let user = message.guild.member(message.mentions.users.first());
    let muteRole = message.guild.roles.cache.find(r => r.name === 'Muté');
    let unmuteRole = message.guild.roles.cache.find(r => r.name === 'les twittos');
    let muteTime = (args[1] || '60s');

    if (user.roles.cache.has(muteRole.id)) return message.reply('le membre est déjà mute.')
  
    if (!muteRole) {
      muteRole = await message.guild.roles.create({
        data: {
          name: 'Muté',
          color: '#000',
          permissions: []
        }
      });
  
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false
        });
      });
    };
  
    await user.roles.add(muteRole.id);
    await user.roles.remove(unmuteRole.id);
    message.channel.send(`<@${user.id}> est muté pour ${ms(ms(muteTime))}.`);
  
    setTimeout(() => {
      user.roles.remove(muteRole.id);
      user.roles.add(unmuteRole.id);
    }, ms(muteTime));
  
    const embed = new MessageEmbed()
      .setAuthor(`${user.user.username} (${user.id})`, user.user.avatarURL())
      .setColor("#ffa500")
      .setDescription(`**Action**: mute\n**Temps**: ${ms(ms(muteTime))}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
      
    client.channels.cache.get('694840832926154752').send(embed);
  }
}