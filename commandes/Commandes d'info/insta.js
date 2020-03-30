const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "Commandes d'info",
    description: "Cherche des info coccasse sur un compte Instagram.",
    usage: "<pseudo>",
    run: async (client, message, args) => {
        const name = args.join(" ");

        if (!name) {
            return message.reply("Peut-être qu'il faut mettre un pseudo nan ?")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.reply("Je trouve personne sur ce compte. :(")
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;

        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Info de profil", stripIndents`**- Pseudo:** ${account.username}
            **- Nom complet :** ${account.full_name}
            **- Biographie :** ${account.biography.length == 0 ? "none" : account.biography}
            **- Postes :** ${account.edge_owner_to_timeline_media.count}
            **- Nombre d'abonnés :** ${account.edge_followed_by.count}
            **- Nombre d'abonnements :** ${account.edge_follow.count}
            **- Compte privé :** ${account.is_private ? "Oui :( 🔐" : "Nope 🔓"}`);

        message.channel.send(embed);
    }
}
