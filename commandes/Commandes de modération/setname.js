module.exports = {
    name: "setname",
    category: "Commandes de modération",
    description: "Change le nom du bot.",
    run: async(mesage, client, args) => {
        if(args.length < 2){
            message.channel.send("y'a pas de nom.");
            return;
        }
    
        var username = "";
        for(var i = 1; i < args.length; i++){
            username += args[i] + " ";
        }
        client.user.setUsername(username)
            .then(user => console.log("--> " + user.username));
    }
}
