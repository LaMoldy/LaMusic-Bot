// Import packages
import { SlashCommandBuilder } from '@discordjs/builders';

// Creates an object in JSON to build a slash command
async function create() {
  const command = new SlashCommandBuilder() // Creates new command
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addUserOption((option) => 
      option
        .setName('user')
        .setDescription('shall I greet a user?')
    );
  
  return command.toJSON(); // Converts to JSON
}

// Called by the event interactionCreate
async function invoke(interaction) {
  const user = interaction.options.getUser('user');

  if (user != null) {
    interaction.reply({ content: `Hello ${user}!` });
  } else {
    interaction.reply({
      content: 'Pong!',
      ephemeral: true
    }); // Replies with pong
  }
}

export { create, invoke };