const fs = require('fs');

module.exports = {
    name: 'unmute',
    category: "Commandes de modération",
    description: 'Unmute un certain membre.',
    usage: '[@user]',
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send("Vous n'avez pas permission de mute ce membre [MANAGE_MESSAGES].");
        }

        let toUnmute = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toUnmute) {
            return message.channel.send('Veuillez tag un membre via mention ou ID');
        }

        if (toUnmute.id == message.author.id) {
            return message.channel.send('Vous ne pouvez pas vous unmute vous-même.');
        }

        if (toUnmute.highestRole.position >= message.member.highestRole.position) {
            return message.channel.send('Vous ne pouvez pas unmute un membre supérieur à votre hiérarchie ou qui possède le même rôle que vous.');
        }

        let role = message.guild.roles.find(r => r.name === 'Muté');

        if (!role || !toUnmute.roles.has(role.id)) {
            return message.channel.send("Ce membre n'est pas mute.");
        }

        await toUnmute.removeRole(role);

        delete client.mutes[toUnmute.id];

        fs.writeFile('./mute.json', JSON.stringify(client.mutes), err => {
            if (err) {
                throw err;
            }
            message.client.send(`J'ai unmute ${toUnmute.user.tag}.`);
        });
    },
};
