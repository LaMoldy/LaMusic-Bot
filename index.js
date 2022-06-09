// Package imports
import { Client, Intents } from 'discord.js';
import fs from 'node:fs';
import { loadCommands } from './deploy-commands.js';
import {} from 'dotenv/config';
import MessageLogger from './utils/messages.js';

// Adds discord permissions for bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

MessageLogger.infoMessage('Starting reloading events for application (/) commands.');

// Gets the command files by looking at the command directory
const events = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'));

(async () => {
  // Checks the event and runs it
  for (const event of events) {
    const eventFile = await import(`#events/${event}`);

    // Check if the command is emitted once
    if (eventFile.once) {
      client.once(eventFile.name, (...args) => {
        eventFile.invoke(...args);
      });
    }
    else {
      client.on(eventFile.name, (...args) => {
        eventFile.invoke(...args);
      })
    }
  }
})();

MessageLogger.infoMessage('Successfully reloaded events for application (/) commands.');

// Reloads the commands on run
loadCommands();

// Assigns the token
if (process.env.ENVIRONMENT === 'prod') {
  client.login(process.env.PROD_TOKEN);
} 
else {
  client.login(process.env.DEV_TOKEN);
}
