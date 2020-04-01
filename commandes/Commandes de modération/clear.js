module.exports = {
    name: "clear",
    aliases: ["purge"],
    category: "Commandes de modération",
    description: "Clear le salon",
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }
    
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Vous n'avez pas les permissions de supprimer de messages.").then(m => m.delete(5000));
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Je ne peux pas supprimer 0 messages voyons !").then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Je ne peux pas supprimer de messages car je n'ai pas les permissions.").then(m => m.delete(5000));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`J'ai supprimé \`${deleted.size}\` messages.`)).then(message.delete(3000))
            .catch(err => message.reply(`Il y a quelque chose qui ne vas pas... ${err}`));
    }
}
