// Package imports
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Gets the .env file variables
require('dotenv').config();

function loadCommands() {
  // Sets the variables for the commands 
  const commands = []; // Array of all loaded commands
  const commandsPath = path.join(__dirname, 'commands'); // Sets the path of the commands directory
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Gets all files that end with extension .js

  // Adds the commands to the array in JSON format
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
  // Creates a new REST api variable
  const rest = new REST({ version: 10 });

  // Checks if environment is in production mode
  if (process.env.ENVIRONMENT === 'prod') {
    rest.setToken(process.env.PROD_TOKEN);

    // Adds the commands to the Discord API
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID_PROD, process.env.GUILD_ID_PROD), { body: commands })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  }
  else {
    rest.setToken(process.env.DEV_TOKEN);

    // Adds the commands to the Discord API
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID_DEV, process.env.GUILD_ID_DEV), { body: commands })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  }
}

module.exports = loadCommands;