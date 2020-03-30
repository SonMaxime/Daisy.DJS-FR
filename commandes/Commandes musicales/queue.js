module.exports = {
    name: "queue",
    category: "Commandes musicales",
    description: "Affiche la liste des sons dans la queue.",
    run: async (client, message, args) => {
        message.channel.send('Bientôt.');
    },
};
