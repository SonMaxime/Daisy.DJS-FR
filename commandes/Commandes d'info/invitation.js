module.exports = {
    name: 'invite',
    aliases: ["in"],
    category: "Commandes d'info",
    description: 'Crée un lien pour inviter le bot dans votre serveur.',
    run: async (client, message, args) => {
        message.channel.send(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
    },
};
