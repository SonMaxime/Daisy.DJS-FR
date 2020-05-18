const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require('fs');
const client = new Client({
    disableEveryone: true
});

const prefix = ".";

config({
    path: __dirname + "/.env"
});

   // Chargement des commandes

client.commands = new Collection();
client.aliases = new Collection();


client.categories = fs.readdirSync("./commandes/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

    // Mise en ligne du bot

client.on("ready", () => {
    console.log(`Hey, ${client.user.username} est en ligne`);
    client.user.setPresence({ activity: { name: '.help | by SonMaxime' }, status: 'dnd' })
    .catch(console.error);
});
   
   // Système de bienvenue automatique

client.on('guildMemberAdd', member => {
    let embed = new MessageEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount + '.')
    member.guild.channels.cache.get('690550169615204413').send(embed)
});

client.on('guildMemberRemove', member => {
    let embed = new MessageEmbed()
        .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name + '.')
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount)
    member.guild.channels.cache.get('690550169615204413').send(embed)
 
});

    // Système de comptage de membre dans un salon vocal

client.on('ready', () => {
    let myGuild = client.guilds.cache.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.cache.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});

client.on('guildMemberAdd', member => {
    let myGuild = client.guilds.cache.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.cache.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});

client.on('guildMemberRemove', member => {
    let myGuild = client.guilds.cache.get('690549564620537889');
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.cache.get('694569846741926028');
    memberCountChannel.setName("Membres : " + memberCount)
    .catch(error => console.log(error));
});


    // Système de validation de réglement

client.on("guildMemberAdd", (member) => {
  member.roles.add('695645685898543205');
});

client.on("message", (message) => {
    if (message.content == (prefix + "verify")) {
      message.delete();
      message.channel.send("C'est bon tu peux passer. :tada:").then(message => message.delete(2000));
        setTimeout(() => {
          message.member.roles.remove('695645685898543205');
          message.member.roles.add('690552702110924801');
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
