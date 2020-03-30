const { RichEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "rps",
    category: "Commandes Fun",
    description: "Pierre, Feuille, Ciseaux ! Réagissez a l'emoji pour jouer.",
    usage: "rps",
    run: async (client, message, args) => {
        const embed = new RichEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
            .setDescription("Réagissez à l'uns de ces emojis pour jouer.")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.clearReactions();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                    return "Tu a gagné !";
            } else if (me === clientChosen) {
                return "Égalité !";
            } else {
                return "Tu as perdu !";
            }
        }
    }
}
