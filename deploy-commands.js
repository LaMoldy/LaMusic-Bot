// Package imports
import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import {} from 'dotenv/config';
import MessageLogger from './utils/messages.js';

export default function loadCommands() {
  // Sets the variables for the commands 
  const commands = []; // Array of all loaded commands
  const commandFiles = fs
    .readdirSync('./events/commands')
    .filter(file => file.endsWith('.js')); // Gets all files that end with extension .js

  // Creates route to Discord
  const rest = new REST({ version: 10 });

  // Checks if environment is in production mode
  if (process.env.ENVIRONMENT === 'prod') {
    rest.setToken(process.env.PROD_TOKEN);
  }
  else {
    rest.setToken(process.env.DEV_TOKEN);
  }

  // Adds the commands to the array in JSON format
  (async () => {
    for (const file of commandFiles) {
      // Imports the command file
      const command = await import(
        `#commands/${file.substring(0, file.length - 3)}`
      );

      // Pushes the command to the commands list
      commands.push(await command.create());
    }

    try {
      MessageLogger.infoMessage('Started reloading application (/) commands.');
      
      // Checks current environment and loads the commands onto the API
      if (process.env.ENVIRONMENT === 'prod') {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID_PROD), { body: commands });
      }
      else {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID_DEV), { body: commands });
      }
    }
    catch (error) {
      MessageLogger.errorMessage(error.message);
    }
    finally {
      MessageLogger.infoMessage('Successfully reloaded application (/) commands.');
    }
  })();
}