import { SlashCommandBuilder } from '@discordjs/builders';
import UtilAudioPlayer from '../../utils/audio.js';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice';
import MessageLogger from '../../utils/messages.js';
import play from 'play-dl';

// Creates an object in JSON to build a slash command
const create = async () => {
  const command = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays audio from YouTube, and Spotify.')
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('Song name or URL for specified song.')
    );

  return command;
}

// Creates execution part of the command
const invoke = async (interaction) => {
  const DEBUG_ROLE_ID = '979858079401246721';
  const PRODUCTION_ROLE_ID = '595478746283376640';

  if (!interaction.member.roles.cache.has(DEBUG_ROLE_ID)
    || !interaction.member.roles.cache.has(PRODUCTION_ROLE_ID)) {
    const song = interaction.options.getString('song');

    // Checks if the song is not null
    if (song) {
      const voiceChannel = interaction.member.voice.channel; // Gets the voice channel

      if (!voiceChannel) {
        interaction.reply({
          content: 'Please connect to a voice channel before using this command'
        });
        return;
      }

      // Checks if the player expired and restarts it
      if (play.is_expired()) {
        await play.refreshToken();
      }

      // Searches for the youtube data with the song name or url
      let searchData = await play.search(song, {
        limit: 1
      });

      let resource = null;

      try {
        const url = searchData[0].url;
        resource = await play.stream(url);
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

      let connection = UtilAudioPlayer.join(voiceChannel); // Joins the voice chat

      let player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play
        }
      }); // Creates the audio player

      UtilAudioPlayer.play(player, connection, resource); // Plays the youtube video audio in the voice chat

      interaction.reply({
        content: 'Started playing YouTube song: ' + searchData[0].title + ' by ' + searchData[0].channel,
        embeds: [{
          image: {
            url: searchData[0].thumbnails[0].url
          }
        }]
      }); // Replies 
    }

    interaction.reply({
      content: 'Must enter a search argument to play video audio'
    });
  }
  else {
    interaction.reply({
      content: 'Must have the Musical Gentlemen role to use this command'
    });
  }
}

export { create, invoke };