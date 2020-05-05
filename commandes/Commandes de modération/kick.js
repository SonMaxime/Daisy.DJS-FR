const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "Commandes de modération",
    description: "Kicker un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "reports") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Veuillez mentionner la personne à kick.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Veuillez provenir une raison.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Vous n'avez pas les permissions de kick un membre.Si le cas est urgent merci de contacter un staff.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Je n'ai pas les permissions de kick un membre.")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toKick) {
            return message.reply("Je ne trouve pas ce membre, réessayer.")
                .then(m => m.delete(5000));
        }

        if (toKick.id === message.author.id) {
            return message.reply("Vous ne pouvez pas vous kick vous même...")
                .then(m => m.delete(5000));
        }

        if (!toKick.kickable) {
            return message.reply("Je ne peux pas kick ce membre due à sa hiérarchie. Je suppose.")
                .then(m => m.delete(5000));
        }
                
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**- Membre kick:** ${toKick} (${toKick.id})
            **- Kick par:** ${message.member} (${message.member.id})
            **- Raison:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Cette vérification sera invalide après 30 secondes.`)
            .setDescription(`Voulez vous kick cette utilisateur ${toKick}?`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Bien....Le kick n'a pas marché... Voici l'erreur : ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
