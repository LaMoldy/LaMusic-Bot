// Import packages
const { SlashCommandBuilder } = require('@discordjs/builders');

// Makes an importable command.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!'); // Replies with pong
  }
}