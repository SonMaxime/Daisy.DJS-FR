module.exports = {
    name: "pause",
    category: "Commandes musicales",
    description: "Pause un son en cours dans une commande vocale.",
    run: async (client, message, args) => {
        message.channel.send('Bientôt.');
    },
};
