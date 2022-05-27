const { SlashCommandBuilder } = require('@discordjs/builders');
const UtilAudioPlayer = require('../utils/audio');
const Discord = require('@discordjs/voice'); 
const play = require('play-dl');

// DEBUG: https://www.youtube.com/watch?v=F64yFFnZfkI&list=RDF64yFFnZfkI&start_radio=1

// Adds global variable to destroy later
let connection;
let player;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Allows for youtube commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('play')
        .setDescription('Plays audio from YouTube url')
        .addStringOption(option =>
          option
            .setName('song')
            .setDescription('Song NAME or URL for specified video audio')
        )
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('stop')
        .setDescription('Stops the YouTube audio from playing')
    ),
  async execute(interaction) {
    const { stream, search } = require('play-dl'); // Imports play-dl stuff.

    if (interaction.options.getSubcommand() === 'play') {
      // Checks to see if the user has the Musical Gentlemen role
      if (process.env.ENVIRONMENT === 'prod') {
        if (!interaction.member.roles.cache.has('595478746283376640')) {
          await interaction.reply('You are not able to use this command.  Please contact someone that has the Musical Gentlemen role to use this command.');
          return;
        }
      }
      else {
        if (!interaction.member.roles.cache.has('979858079401246721')) {
          await interaction.reply('You are not able to use this command.  Please contact someone that has the Musical Gentlemen role to use this command.');
          return;
        }
      }

      const song = interaction.options.getString('song');
      if (song) {
        const voiceChannel = interaction.member.voice.channel; // gets the voice channel of the user

        // Checks if the user is in a voice channel
        if (!voiceChannel) return await interaction.reply('Please connect to a voice channel before using this command.');

        // searches for the youtube data with the song name or url
        let yt_info = await search(song, {
          limit: 1
        });

        // Makes the resource from the youtube video
        const playStream = await stream(yt_info[0].url);

        // Gets the permissions for the bot
        const permissions = voiceChannel.permissionsFor(interaction.client.user);

        // Checks the connect permission
        if (!permissions.has('CONNECT')) {
          await interaction.reply('I need permission to join the voice chat.');
          return;
        }
        // Checks the speak permission
        else if (!permissions.has('SPEAK')) {
          await interaction.reply('I need permission to speak in the voice chat');
          return;
        }

        connection = UtilAudioPlayer.join(voiceChannel); // Joins the voice chat

        player = Discord.createAudioPlayer(); // Creates the audio player

        UtilAudioPlayer.play(player, connection, playStream); // Plays the youtube video audio in the voice chat

        await interaction.reply('Started playing YouTube song: ' + yt_info[0].title + ' by '  + yt_info[0].channel); // Replies to the user
      }

      else {
        await interaction.reply('Please pass a YouTube url or song name to start playing audio from YouTube.'); // Replies to the user
      }
    }

    // Stops the bot and kicks it from the voice channel
    if (interaction.options.getSubcommand() === 'stop') {
      UtilAudioPlayer.stop(connection); // Stops and disconnects from voice channel.
      await interaction.reply('YouTube audio has been stopped and disconnected from the voice channel.'); // Replies to the user.
    }
  }
}