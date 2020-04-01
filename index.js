const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commandes/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hey, ${client.user.username} est en ligne`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "/help | by SonMaxime",
            type: "WATCHING"
        }
    }); 
});

client.on('guildCreate', async (guild) => {
    if (!guild.available) return;

    const embed = new MessageEmbed({
        author: {
            name: "Hello, I'm Daisy !",
            iconURL: client.user.displayAvatarURL()
        },
        description: `Tu viens de m'ajouter à **${guild.name}**.\n\n Je suis un bot créé par SonMaxime.#9355`,

        timestamp: moment().format('LLL'),
        footer: {
            text: client.user.tag
        }
    });

    guild.owner.send({embed});
})

client.on('guildMemberAdd', member =>{
    let embed = new RichEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount + '.')
    member.guild.channels.get('690550169615204413').send(embed)
    member.addRole('690550415259074560')
});

client.on('guildMemberRemove', member =>{
    let embed = new RichEmbed()
        .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name + '.')
        .setFooter('Nous sommes maintenant ' + member.guild.memberCount)
    member.guild.channels.get('690550169615204413').send(embed)
 
});

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

client.on("message", async message => {
    const prefix = "/";

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
