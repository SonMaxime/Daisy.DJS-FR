module.exports = {
    name: "reboot",
    category: "Commandes perso",
    description: "reboot",
    run: async(client, message, args) => {
        if (message.author.id !== "492402867953467392") return message.channel.send('non');
        process.exit(1);
    }
}