const { SlashCommandBuilder } = require('@discordjs/builders');
const UtilAudioPlayer = require('../utils/audio');
const Discord = require('@discordjs/voice');
const play = require('play-dl');

let connection;
let player;

// DEBUG: https://open.spotify.com/track/6z1TvLTR0oOsWSJfDrERmj?si=149d8acc2bd14768

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('allows for use of spotify sub commands.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('play')
        .setDescription('Plays audio from spotify')
        .addStringOption(option =>
          option
            .setName('song')
            .setDescription('NAME or URL of the song from Spotify')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('Stops the Spotify audio from playing')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'play') {
      const song = interaction.options.getString('song');

      if (song) {
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

        // Gets the voice channel of the user
        const voiceChannel = interaction.member.voice.channel;

        // Checks if the user is in a voice channel
        if (!voiceChannel) return await interaction.reply('Please connect to a voice channel before using this command.');

        // Checks if the player expired and restarts it
        if (play.is_expired()) {
          await play.refreshToken();
        }

        // Searches the song on spotify
        let sp_result = await play.search(song, {
          limit: 1
        });

        // Gets the Youtube url of that song
        let stream = await play.stream(sp_result[0].url);

        // Gets the permissions
        const permissions = voiceChannel.permissionsFor(interaction.client.user);

        // Checks to make sure the permissons allow the bot the function correctly
        if (!permissions.has('CONNECT')) {
          await interaction.reply('I need permission to join the voice chat.');
          return;
        }
        else if (!permissions.has('SPEAK')) {
          await interaction.reply('I need permission to speak in the voice chat');
          return;
        }

        // Joins the voice channel
        connection = UtilAudioPlayer.join(voiceChannel);

        // Creates the audio player
        player = Discord.createAudioPlayer({
          behaviors: {
            noSubscriber: Discord.NoSubscriberBehavior.Play
          }
        });

        // Plays the audio
        UtilAudioPlayer.play(player, connection, stream); 

        // Replies to the user
        await interaction.reply('Started playing: ' + sp_result[0].title + ' by ' + sp_result[0].channel);
      }
      else {
        await interaction.reply('Please pass a spotify url or song name to start playing audio from Spotify.')
      }
    }
    if (interaction.options.getSubcommand() === 'stop') {
      UtilAudioPlayer.stop(connection);
      await interaction.reply('Spotify audio has been stopped.')
    }
  }
}