module.exports = {
    name: "play",
    category: "Commandes musicales",
    description: "Joue un son dans un salon vocal.",
    run: async (client, message, args) => {
        message.channel.send('Bientôt.');
    },
};
