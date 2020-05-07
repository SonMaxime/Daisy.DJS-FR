module.exports = {
    name: "magik",
    category: "Commandes Fun",
    description: "Modifie votre pp façon mAgIk",
    run: async function (message, client, args) {
    let avatarurl = message.mentions.length > 0 ? message.mentions[0].staticAvatarURL : message.author.staticAvatarURL
    if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(x => args.join(' ').includes(x))) {
      avatarurl = args.join(' ').replace(/gif|webp/g, 'png')
    }
    avatarurl = avatarurl.replace(/=128/g, '=1024')
    const data = await client._snek
      .get(`https://discord.services/api/magik?url=${avatarurl}`)
  
    if (data.status === 200) {
      await message.channel.createMessage('', { file: data.body, name: 'magik.png' })
    } else {
      message.channel.createMessage(`Error: ${data.text}`)
    }
  }
}
