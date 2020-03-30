module.exports = {
    name: 'pp',
    category: "Commandes d'info",
    aliases: ['icone', 'logo'],
    description: 'Affiche la pp de qui tu veux.',
    usage: '[@user]',
    run: async (client, message, args) => {
        if (!message.mentions.users.size) {
            return message.channel.send(`Ta pp: ${message.author.displayAvatarURL}`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `L'avatar de ${user.username} : ${user.displayAvatarURL}`;
        });
        message.channel.send(avatarList);
    },
};
