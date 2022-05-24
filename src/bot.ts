const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] }); 
require('dotenv').config();

client.on('ready', () => { 
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
})

client.login(process.env.TOKEN);