import { SlashCommandBuilder } from '@discordjs/builders';
import UtilAudioPlayer from '../../utils/audio.js';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice';
import play from'play-dl';
import MessageLogger from '../../utils/messages.js';

let connection;
let player;


async function create() {
  const command = new SlashCommandBuilder()
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
    );

  return command.toJSON();
}

async function invoke(interaction) {
  if (interaction.options.getSubcommand() === 'play') {
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

    // Gets the song from the arguments
    const song = interaction.options.getString('song');

    if (song) {
      // Gets the voice channel of the user
      const voiceChannel = interaction.member.voice.channel;

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

      // Searches the song on spotify
      let sp_result = await play.search(song, {
        limit: 1
      });

      // Makes the resource from the Spotify Youtube video
      let stream = null;

      try {
        // Gets the Youtube url of that song
        stream = await play.stream(sp_result[0].url);
      }
      catch (error) {
        interaction.reply({
          content: 'Spotify video is currently unavailable. Please try again in a couple minutes.'
        });
        MessageLogger.warningMessage(error.message + ' while trying to play song: ' + song);
        return;
      }

      // Gets the permissions
      const permissions = voiceChannel.permissionsFor(interaction.client.user);

      // Checks to make sure the permissons allow the bot the function correctly
      if (!permissions.has('CONNECT')) {
        interaction.reply({
          content: 'I need permission to join the voice chat.'
        });
        return;
      }
      else if (!permissions.has('SPEAK')) {
        interaction.reply({
          content: 'I need permission to speak in the voice chat'
        });
        return;
      }

      // Joins the voice channel
      connection = UtilAudioPlayer.join(voiceChannel);

      // Creates the audio player
      player = createAudioPlayer();

      // Plays the audio
      UtilAudioPlayer.play(player, connection, stream); 

      // Replies to the user
      interaction.reply({
        content: 'Started playing: ' + sp_result[0].title + ' by ' + sp_result[0].channel,
        embeds: [{
          image: {
            url: sp_result[0].thumbnails[0].url
          }
        }]
      });
    }
    else {
      interaction.reply({
        content: 'Please pass a spotify url or song name to start playing audio from Spotify.'
      }); // Replies to the user
      return;
    }
  }
  if (interaction.options.getSubcommand() === 'stop') {
    try {
      UtilAudioPlayer.stop(connection);
      interaction.reply({
        content: 'Spotify audio has been stopped and disconnected from the voice channel.'
      }); // Replies to the user
    }
    catch (error) {
      interaction.reply({
        conent: 'Error removing from the voice channel. If this continues please contact LaMoldy or Horbet'
      });
      MessageLogger.warningMessage('MoldyBot might have crashed recently. Please check previous messages.');
      MessageLogger.errorMessage(error.message);
      return;
    }
  }
}

export { create, invoke };