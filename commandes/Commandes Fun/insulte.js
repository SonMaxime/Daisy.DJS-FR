const request = require('superagent');

module.exports = {
    name: 'insulte',
    category: "Commandes Fun",
    description: 'Insulte la personne taggé ou vous même si vous ne tagguez personne.',
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id);

        request.get('http://quandyfactory.com/insult/json/')
            .end((err, res) => {
                if (!err && res.status === 200) {
                    const fancyinsult = res.body;
                    message.channel.send(`${user} ${fancyinsult.insult}`);
                } 
                else {
                    console.log(`REST call failed: ${err}`)
                }
            });
    },
};
