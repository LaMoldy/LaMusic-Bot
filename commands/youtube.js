const { SlashCommandBuilder } = require('@discordjs/builders');
const UtilAudioPlayer = require('../utils/audio');
const Discord = require('@discordjs/voice'); 
const play = require('play-dl');

// DEBUG: https://www.youtube.com/watch?v=F64yFFnZfkI&list=RDF64yFFnZfkI&start_radio=1

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
            .setDescription('Song name for specified video audio')
        )
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('stop')
        .setDescription('Stops the YouTube audio from playing')
    ),
  async execute(interaction) {
    const { stream, search } = require('play-dl');

    if (interaction.options.getSubcommand() === 'play') {
      const song = interaction.options.getString('song');
      if (song) {
        const voiceChannel = interaction.member.voice.channel;

        let yt_info = await search(song, {
          limit: 1
        });
        const playStream = await stream(yt_info[0].url);

        const permissions = voiceChannel.permissionsFor(interaction.client.user);

        if (!permissions.has('CONNECT')) {
          await interaction.reply('I need permission to join the voice chat.');
          return;
        }
        else if (!permissions.has('SPEAK')) {
          await interaction.reply('I need permission to speak in the voice chat');
          return;
        }

        connection = UtilAudioPlayer.join(voiceChannel);

        player = Discord.createAudioPlayer();

        UtilAudioPlayer.play(player, connection, playStream);

        await interaction.reply('Started playing YouTube URL: ' + song);
      }

      else {
        await interaction.reply('Please pass a YouTube url to start playing audio from YouTube.');
      }
    }

    if (interaction.options.getSubcommand() === 'stop') {
      UtilAudioPlayer.stop(connection);
      await interaction.reply('YouTube audio has been stopped.');
    }
  }
}