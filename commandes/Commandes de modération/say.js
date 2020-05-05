const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "Commandes de modération",
    description: "Faites moi dire n'importe quel phrase.",
    usage: "<input>",
    run: (client, message, args) => {
        message.delete();


        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("T'as pas le droit de me faire parler. :stuck_out_tongue: ").then(m => m.delete(5000));

        if (args.length < 0)
            return message.reply("Rien a dire ?").then(m => m.delete(5000));

        const roleColor = message.guild.me.highestRole.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}