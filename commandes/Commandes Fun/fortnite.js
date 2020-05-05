const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const Client = require("fortnite");
const ft = new Client(process.env.FORTNITE);

module.exports = {
    name: "fortnite",
    aliases: ["ftn"],
    category: "Commandes Fun",
    description: "Affiche les stats d'un joueur ou la boutique du jour",
    usage: "<pseudo [pc,xb1,psn] | store>",
    run: async (client, message, args) => {
        const platforms = ["pc", "xb1", "psn"];
        
        if (args[0].toLowerCase() === "store") {
          const store = await ft.store();

            const storeEmbed = new MessageEmbed()
                .setColor("#9d4dbb")
                .setFooter("Boutique du jour", message.author.displayAvatarURL)
                .setTimestamp();

            store.sort((a, b) => {
                return b.vbucks - a.vbucks;
            });

            store.forEach(el => {
                embed.addField(el.name, stripIndents`**- Rareté:** ${el.rarity}
                **- Prix:** ${el.vbucks} v-bucks
                **- Image:** [Appuiez](${el.image})`, true)
            });

            message.channel.send(storeEmbed);
            
        } else {
            const lastWord = args[args.length - 1].toLowerCase();
            
            let platform, username; 

            if (platforms.includes(lastWord)) {
                username = args.slice(0, args.length - 1).join(" "); 
                platform = lastWord;
            } else {    
                username = args.join(" ");
                platform = "pc";
            }
            
            const search = await ft.user(username, platform);

            if (!search.username) {
                return message.channel.send("Je ne troue pas ce joueur, réessayer.")
                    .then(m => m.delete(5000));
            }
            
            const lifetime = search.stats.lifetime;
            const solo = search.stats.solo;
            const duo = search.stats.duo;
            const squad = search.stats.squad;

            const embed = new MessageEmbed()
                .setTitle(`${search.username} (${search.platform})`)
                .setURL(search.url)
                .setColor("#9d4dbb")
                .setFooter(`API Fortnite depuis fortnitetracker.com`, message.author.displayAvatarURL)
                .setTimestamp()
                .addField("Solo :", stripIndents`**- Tops 1 :** ${solo.wins}
                **- KD:** ${solo.kd}
                **- Kills:** ${solo.kills}
                **- Kills par parties:** ${solo.kills_per_match}`, true)
                .addField("Duo :", stripIndents`**- Tops 1 :** ${duo.wins}
                **- KD:** ${duo.kd}
                **- Kills:** ${duo.kills}
                **- Kills par parties:** ${duo.kills_per_match}`, true)
                .addField("Equipe :", stripIndents`**- Tops 1 :** ${squad.wins}
                **- KD:** ${squad.kd}
                **- Kills:** ${squad.kills}
                **- Kills par parties:** ${squad.kills_per_match}`, true)
                .addField("Total :", stripIndents`**- Tops 1 :** ${lifetime.wins}
                **- KD:** ${lifetime.kd}
                **- Kills:** ${lifetime.kills}`, false)

            message.channel.send(embed)
        }
    }
}
