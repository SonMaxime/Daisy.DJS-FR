const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "hmmm",
    category: "Commandes Fun",
    description: "Envoie un hmmm depuis le subReedit :/r/hmmm",
    run: async (client, message, args) => {
        const subReddits = ["hmmm"];
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
