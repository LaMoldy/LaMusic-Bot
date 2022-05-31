import { SlashCommandBuilder } from '@discordjs/builders';
import UtilAudioPlayer from '../../utils/audio.js';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice'; 
import MessageLogger from '../../utils/messages.js';
import play from 'play-dl';

// Adds global variable to destroy later
let connection = null;
let player = null;

// Creates an object in JSON to build a slash command
async function create() {
  const command = new SlashCommandBuilder() // Creates new command
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
    );

  return command.toJSON();
}

async function invoke(interaction) {
  if (interaction.options.getSubcommand() === 'play') {
    // Checks to see if the user has the Musical Gentlemen role
    if (process.env.ENVIRONMENT === 'prod') {
      if (!interaction.member.roles.cache.has('595478746283376640')) {
        interaction.reply({
          content: 'You are not able to use this command.  Please contact someone that has the Musical Gentlemen role to use this command.'
        });
        return;
      }
    }
    else {
      if (!interaction.member.roles.cache.has('979858079401246721')) {
        interaction.reply({
          content: 'You are not able to use this command.  Please contact someone that has the Musical Gentlemen role to use this command.'
        });
        return;
      }
    }

    // Gets the song argument
    const song = interaction.options.getString('song');

    // Checks if song is not null
    if (song) {
      // Gets the voice channel of the user
      const voiceChannel = interaction.member.voice.channel; // gets the voice channel of the user

      // Checks if the user is in a voice channel
      if (!voiceChannel) {
        interaction.reply({
          content: 'Please connect to a voice channel before using this command.'
        });
        return;
      }

      // Checks if the player expired and restarts it
      if (play.is_expired()) {
        await play.refreshToken();
      }

      // searches for the youtube data with the song name or url
      let yt_info = await play.search(song, {
        limit: 1
      });

      // Makes the resource from the youtube video
      let playStream = null;

      try {
        const url = yt_info[0].url;
        playStream = await play.stream(url);
      }
      catch (error) {
        interaction.reply({
          content: 'YouTube video is currently unavailable. Please try again in a couple minutes.'
        });
        MessageLogger.warningMessage(error.message + ' while trying to play song: ' + song); 
        return;
      }
      
      // Gets the permissions for the bot
      const permissions = voiceChannel.permissionsFor(interaction.client.user);

      // Checks the connect permission
      if (!permissions.has('CONNECT')) {
        interaction.reply({
          content: 'I need permission to join the voice chat.'
        });
        return;
      }
      // Checks the speak permission
      else if (!permissions.has('SPEAK')) {
        interaction.reply({
          content: 'I need permission to speak in the voice chat'
        });
        return;
      }

      connection = UtilAudioPlayer.join(voiceChannel); // Joins the voice chat

      player = createAudioPlayer(); // Creates the audio player

      UtilAudioPlayer.play(player, connection, playStream); // Plays the youtube video audio in the voice chat

      interaction.reply({
        content: 'Started playing YouTube song: ' + yt_info[0].title + ' by '  + yt_info[0].channel,
        embeds: [{
          image: {
            url: yt_info[0].thumbnails[0].url
          }
        }]
      }); // Replies to the user
    }

    else {
      interaction.reply({
        content: 'Please pass a YouTube url or song name to start playing audio from YouTube.'
      }); // Replies to the user
      return;
    }
  }

  // Stops the bot and kicks it from the voice channel
  if (interaction.options.getSubcommand() === 'stop') {
    try {
      UtilAudioPlayer.stop(connection); // Stops and disconnects from voice channel.
      interaction.reply({
        content: 'YouTube audio has been stopped and disconnected from the voice channel.'
      }); // Replies to the user.
    }
    catch (error) {
      interaction.reply({
        conent: 'Error removing from the voice channel. If this continues please contact Horbet or Atomic'
      });
      MessageLogger.warningMessage('MoldyBot might have crashed recently. Please check previous messages.');
      MessageLogger.errorMessage(error.message);
      return;
    }
  }
}

export { create, invoke };