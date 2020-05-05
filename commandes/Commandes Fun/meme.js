const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "meme",
    category: "Commandes Fun",
    description: "Envoie un meme depuis les subReedits : dankmeme,meme et me_irl",
    run: async (client, message, args) => {
        const subReddits = ["dankmeme", "meme", "me_irl"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const img = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle(`de /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);

        message.channel.send(embed);
    }
}
