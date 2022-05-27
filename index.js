// Package imports
const { Client, Intents, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config(); 

// Adds discord permissions for bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Makes a new collection of commands
client.commands = new Collection();

// Gets the command files by looking at the command directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Sets the commands from the commands directory
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  client.commands.set(command.data.name, command);
}

// Sends a message when the bot is launched
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Runs the commands when there is a slash command used.
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName); // Gets the name of the command

  if (!command) return; // If the command doesn't exist.

  // tries to execute the command
  try {
    await command.execute(interaction);
  }
  // catches any error and responds with it in the console and discord
  catch (error) { 
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Assigns the token
if (process.env.ENVIRONMENT === 'prod') {
  client.login(process.env.PROD_TOKEN);
} 
else {
  client.login(process.env.DEV_TOKEN);
}