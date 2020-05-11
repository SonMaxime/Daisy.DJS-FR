module.exports = (client, messageReaction, user) => {
    const message = messageReaction.message;
    const member = message.guild.members.cache.get(user.id);
    const emoji = messageReaction.emoji.name;
    const channel = mesasge.guild.channels.chache.find(c.id === '709361522891292763');
    const notifs = message.guild.roles.cache.get("709366172205842493");
    const twitter = message.guild.roles.cache.get("709368093939335330")
    if (member.user.bot) return;

    if (["notifs", "twitter"].includes(emoji) && message.channel.id === channel.id) {
        switch(emoji) {
            case "notifs":
                member.roles.remove(notifs);
                message.channel.send(`Le rôle ${notifs.name} a été ajouté.`);
                break;
            
            case "twitter":
                member.roles.remove(twitter);
                message.channel.send(`Le rôle ${twitter.name} a été ajouté.`);
                break;
        }
    }
}