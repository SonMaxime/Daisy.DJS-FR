module.exports = {
    name: "ping",
    category: "Commandes d'info",
    description: "Renvoie le ping d'un membre et de l'API Discord.JS",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong !
        Ta latence est de ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms
        La latence de l'API est de ${Math.round(client.ping)}ms`);
    }
}