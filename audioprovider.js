const YTDL = require('ytdl-core');
const YTF = require('youtube-finder');
const main = require('./bot.js');
const Discord = require('discord.js');
const YTDLdisc = require('ytdl-core-discord');

// all servers with their play queues and audio providers
var guilds = {};

// youtube video searcher
const ytclient = YTF.createClient({key: main.config().YOUTUBE_APIKEY});

// methods //
exports.queueSong = (message, searchString) => {
    // get guild id
    var guildId = message.guild.id;

    // create guild object if it doesnt exist
    if(!guilds[guildId]) guilds[guildId] = {
        playQueue: [],
        nowPlaying: null,
        loop: false
    };

    // get guild object
    var g = guilds[guildId];

    // search for song on youtube and get video id
    var params = {
        part: 'id',
        q: searchString,
        maxResults: 1,
        type: 'video'
    }
    ytclient.search(params, function(err, data) {
        //console.log("STRING:" + searchString + "\n---\n" + data);
        //console.log(data.items[0]);

        if(data.items.length == 0){
            message.channel.send("<:warning:408740166715310100> No song found");
            return;
        }
        var vidId = data.items[0].id.videoId;

        // get info about video
        YTDL.getInfo(vidId, (err, info) => {
            // parse time to minutes:seconds
            let min = ~~(info.player_response.videoDetails.lengthSeconds / 60);
            let sec = ('0' + ~~(info.player_response.videoDetails.lengthSeconds % 60)).slice(0, 2);
            let vidL = min + ":" + sec;

            var song = {
                id: vidId,
                title: vidId,
                length: vidL
            };
            if(!err) song.title = info.player_response.videoDetails.title;

            let ytVidUrl = "https://www.youtube.com/watch?v=" + song.id;
            let vidLcodeTags = "`" + song.length + "`";

            var embed = new Discord.RichEmbed()
                .setColor(9955331)
                .setDescription(`<:musical_note:408759580080865280> **Queued song:** [${song.title}](${ytVidUrl}) | ${vidLcodeTags}`);

            message.channel.send(embed);

            g.playQueue.push(song);
            console.log("--> Queued song: " + song.title + " (" + vidId + ")");

            // join voice channel if not in one already
            if(!message.guild.voiceConnection){
                message.member.voiceChannel.join().then((connection) => {
                    playSong(connection, guildId);
                    console.log("--> Joined voice channel: "
                                + message.member.voiceChannel.name);
                });
            }
        });
    });
};

async function playSong(connection, guildId){
    var g = guilds[guildId];

    // for some reason this works again
    g.dispatcher = connection.playStream(YTDL(g.playQueue[0].id, {filter: "audioonly"}));

    // ...and this doesnt work xD
    //var url = g.playQueue[0].id;
    //g.dispatcher = connection.playOpusStream(await YTDLdisc(url, {filter: "audioonly"}));

    console.log("--> Started playing song: " + g.playQueue[0].title
                                        + " (" + g.playQueue[0].id + ")");
    g.nowPlaying = g.playQueue[0];
    g.playQueue.shift();

    g.dispatcher.on("end", end => {
        console.log("--> Song ended");

        if(g.loop){
            g.playQueue.push(g.nowPlaying);
        }
        g.nowPlaying = null;
        if(g.playQueue[0]){
            // play next song if there are more in the Q
            playSong(connection, guildId);
        }else{
            // leave voice channel if last song
            connection.disconnect();
            console.log("--> Leaving voice channel: " + connection.channel.name);
        }
    });
}

exports.pauseSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.pause();
    console.log("--> Paused song");
};

exports.resumeSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.resume();
    console.log("--> Resumed song");
};

exports.skipSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.end();
};

exports.stopSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    // remove rest of songs or dispatcher onEnd will keep looping
    g.loop = false;
    g.playQueue = [];
    if(g.dispatcher) g.dispatcher.end();
};

exports.playQueue = (guildId, channel) => {
    // check if something is playing
    if(!guilds[guildId] || !guilds[guildId].nowPlaying){
        var embed = new Discord.RichEmbed()
            .setColor(9955331)
            .setDescription("<:mute:456503709443293186> Not Playing");
        channel.send(embed);
        return;
    }

    var g = guilds[guildId];
    var q = "";
    var i = 1;
    let ytBaseUrl = "https://www.youtube.com/watch?v=";
    g.playQueue.forEach((song) => {
        let ytLink = ytBaseUrl + song.id;
        let title = song.title;
        if(title.length > 60) title = title.substring(0, 55) + "... ";
        q += "`" + i++ + "`. ";
        q += `[${title}](${ytLink}) | `;
        q += "`" + song.length + "`\n";
    });

    let currSong = g.nowPlaying.title;
    if(currSong.length > 60) currSong = currSong.substring(0, 55) + "... ";
    var cs = `[${currSong}](${ytBaseUrl+g.nowPlaying.id}) | `;
    cs += "`" + g.nowPlaying.length + "`";

    var embed = new Discord.RichEmbed()
        .setColor(9955331)
        .addField("<:musical_note:408759580080865280> Now Playing", cs);
        if(g.loop)  embed.setFooter("🔁 Looping playlist");
        if(q != "") embed.addField("<:notes:433601162827137026> Play Queue", q);

    channel.send(embed);
}

exports.toggleLoop = (guildId, channel) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    g.loop = !(g.loop);
    console.log("set looping to: " + g.loop);
    if(g.loop){
        channel.send("<:musical_note:408759580080865280> Looping playlist");
    }else{
        channel.send("<:musical_note:408759580080865280> Turned off looping")
    }
};
