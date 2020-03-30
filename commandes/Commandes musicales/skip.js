module.exports = {
    name: "skip",
    category: "Commandes musicales",
    description: "Skip un son dans la queue ou le son joué actuellement.",
    run: async (client, message, args) => {
        message.channel.send('Bientôt.');
    },
};
