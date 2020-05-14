const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "Commandes de modération",
    description: "Bannis un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "reports") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Veuillez mentionner une personne a bannir.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Merci de provenir une raison de ce bannissement.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Vous n'avez pas la permission de bannir un membre.Si le cas est urgent merci de contacter un modérateur.")
                .then(m => m.delete(5000));
        
        }
        
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Je n'ai pas les permissions pour bannir un membre.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toBan) {
            return message.reply("Membre non trouvé, réessayer.")
                .then(m => m.delete(5000));
        }

        if (toBan.id === message.author.id) {
            return message.reply("Vous ne pouvez pas vous bannir vous même...")
                .then(m => m.delete(5000));
        }

        if (!toBan.bannable) {
            return message.reply("Je ne peux pas bannir ce membre due a sa hiérarchie.Je suppose...")
                .then(m => m.delete(5000));
        }
        
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**- Membre banni:** ${toBan} (${toBan.id})
            **- Banni par:** ${message.member} (${message.member.id})
            **- Raison:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Cette verification expire dans 30s.`)
            .setDescription(`Voulez vous bannir ${toBan}?`)
            .setImage('https://media.giphy.com/media/fV2nn1TcXTSzUzxUMC/giphy.gif')

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            
            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Bien....Le ban n'a pas fonctionné... Voilà l'erreur : ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Ban annué.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
