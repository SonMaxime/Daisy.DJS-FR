const { Client, Collection, RichEmbed } = require("discord.js");
const antispam = require('discord-antispam-fr');
const { config } = require("dotenv");
const fs = require('fs');
const client = new Client({
    disableEveryone: true
});

const prefix = ".";

   // Chargement des commandes

client.commands = new Collection();
client.aliases = new Collection();


client.categories = fs.readdirSync("./commandes/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

    // Mise en ligne du bot

client.on("ready", () => {
    console.log(`Hey, ${client.user.username} est en ligne`);

    client.user.setPresence({
        status: "online",
        game: {
            name: ".help | by SonMaxime",
            type: "STREAMING"
        }
    }); 
});

// anti spam fonction

client.on('ready', () => {
     antispam(client, {
          limitUntilWarn: 3,
          limitUntilMuted: 5,
          interval: 2000,
          warningMessage: "if you don't stop from spamming, I'm going to punish you!",
          muteMessage: "was muted since we don't like too much advertisement type people!",
          maxDuplicatesWarning: 7,
          maxDuplicatesMute: 10,
          ignoredRoles: ["Admin"],
          ignoredMembers: ["SonMaxime.#9355"],
          mutedRole: "Muté",
          timeMuted: 1000 * 600,
          logChannel: "reports"
        });
  });
   
  client.on('message', msg => {
    client.emit('checkMessage', msg);
});
   // Système de bienvenue automatique

client.on('guildMemberAdd', member => {
    let embed = new RichEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount + '.')
    member.guild.channels.get('690550169615204413').send(embed)
});

client.on('guildMemberRemove', member => {
    let embed = new RichEmbed()
        .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name + '.')
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount)
    member.guild.channels.get('690550169615204413').send(embed)
 
});

    // Système de comptage de membre dans un salon vocal

client.on('ready', () => {
    let myGuild = client.guilds.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});

client.on('guildMemberAdd', member => {
    let myGuild = client.guilds.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});

client.on('guildMemberRemove', member => {
    let myGuild = client.guilds.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});


    // Système de validation de réglement

client.on("guildMemberAdd", (member) => {
  member.addRole(member.guild.roles.find(role => role.name === "Verifying"));
});

client.on("message", (message) => {
  if (message.content == (prefix + "verify")) {
    message.delete();
    message.channel.send("C'est bon tu peux passer. :tada:").then(msg => {
      msg.delete(2000);
      setTimeout(() => {
        message.member.removeRole(message.guild.roles.find(role => role.name === "Verifying"));
        message.member.addRole('690552702110924801');
      });
    });
  }
});

    // Système d'execution de commande

client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});

client.login(process.env.TOKEN);
