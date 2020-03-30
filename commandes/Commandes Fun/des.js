module.exports = {
    name: 'deshasard',
    aliases: ["des"],
    category: "Commandes Fun",
    description: 'Tourne un dès avec 6 faces par défaut.',
    usage: '[nombre de faces]',
    run: async (client, message, args) => {
        if(!args[0]) {
            args[0] = 6;
          }

          let result = (Math.floor(Math.random() * Math.floor(args[0])));
          message.channel.send(`résultat : ${result + 1}!`);
    },
};
