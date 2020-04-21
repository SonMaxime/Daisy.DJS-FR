const { Client, Collection, RichEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require('fs');
const client = new Client({
    disableEveryone: true
});

const prefix = ".";

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

const usersMap = new Map();
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;

client.on('message', message => {
  if(message.author.bot) return;
  if(usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    console.log(difference);
    if(difference > DIFF) {
      clearTimeout(timer);
      console.log('Cleared timeout');
      userData.msgCount = 1;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
        console.log('Removed from RESET.');
      }, TIME);
      usersMap.set(message.author.id, userData);
    }
    else {
      ++msgCount;
      if(parseInt(msgCount) === LIMIT) {
        const role = message.guild.roles.cache.get('');
        message.member.roles.add(role);
        message.channel.send('Vous avez été mute.');
        setTimeout(() => {
          message.member.roles.remove(role);
          message.channel.send('Vous avez été demute.');
        }, TIME);
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  }
  else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
      console.log('Removed from map.');
    }, TIME);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn
    });
  }
});

   // Système d'ajout de rôle et de bienvenue automatique

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
