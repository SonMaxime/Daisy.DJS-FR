const fs = require('fs');

module.exports = {
    name: 'mute',
    category: "Commandes de modération",
    description: 'Mute un membre spécifique.',
    usage: '[@user] [temps de mute]',
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send("Vous n'avez pas le droit de muter un membre. [MANAGE_MESSAGES]");
        }

        let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toMute) {
            return message.channel.send('Veuillez mentionner un membre via son tag ou son ID.');
        }

        if (toMute.id == message.author.id) {
            return message.channel.send('Vous ne pouvez pas vous muter vous-même.');
        }

        if (toMute.highestRole.position >= message.member.highestRole.position) {
            return message.channel.send('Vous ne pouvez pas muter un membre supérieur à votre hiérarchie ou qui possède le même rôle que vous.');
        }

        let role = message.guild.roles.find(r => r.name == 'Muté');

        if (!role) {
            try {
                role = await message.guild.createRole({
                    name: 'Muté',
                    color: '#000000',
                    permissions: [],
                });

                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
            }
            catch (e) {
                console.log(e.stack);
            }
        }

        if (toMute.roles.has(role.id)) {
            return message.channel.send('Ce membre est déjà mute.');
        }

        if (isNaN(args[1])) {
            return message.reply("Le temps de mute ne correspond pas.");
        }

        client.mutes[toMute.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * 1000,
        };

        fs.writeFile('./mute.json', JSON.stringify(client.mutes, null, 4), err => {
            if (err) {
                throw err;
            }
            message.channel.send("J'ai mute ce membre.");
        });

        await toMute.addRole(role);
    },
};
