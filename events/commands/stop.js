import { SlashCommandBuilder } from '@discordjs/builders';
import { getVoiceConnection } from '@discordjs/voice';

// Creates the command
const create = async () => {
  const command = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Disconnects the bot from voice channel.');

  return command;
}

// Executes the command
const invoke = async (interaction) => {
  const DEBUG_ROLE_ID = '979858079401246721';
  const PRODUCTION_ROLE_ID = '595478746283376640';

  if (!interaction.member.roles.cache.has(DEBUG_ROLE_ID)
    || !interaction.member.roles.cache.has(PRODUCTION_ROLE_ID)) {
    const connection = getVoiceConnection(interaction.guild.id); // Gets the connection status

    if (!connection) {
      interaction.reply({
        content: 'Currently not in a voice channel.'
      });
      return;
    }

    connection.destroy(); // Leaves the voice channel

    interaction.reply({
      content: 'MoldyBot has been disconnected from the voice channel'
    })
  }
  else {
    interaction.reply({
      content: 'Must have Musical Gentlemen role to use this command.'
    });
  }
}

export { create, invoke };