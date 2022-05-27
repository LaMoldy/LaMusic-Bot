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
            .setDescription('Name of the song from Spotify')
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
        const voiceChannel = interaction.member.voice.channel;

        // Checks if the user is in a voice channel
        if (!voiceChannel) return await interaction.reply('Please connect to a voice channel before using this command.');

        if (play.is_expired()) {
          await play.refreshToken();
        }

        let sp_result = await play.search(song, {
          limit: 1
        });

        let stream = await play.stream(sp_result[0].url);

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

        player = Discord.createAudioPlayer({
          behaviors: {
            noSubscriber: Discord.NoSubscriberBehavior.Play
          }
        });

        UtilAudioPlayer.play(player, connection, stream); 

        await interaction.reply('Started playing: ' + sp_result[0].title);
      }
      else {
        await interaction.reply('Please pass a spotify url to start playing audio from Spotify.')
      }
    }
    if (interaction.options.getSubcommand() === 'stop') {
      UtilAudioPlayer.stop(connection);
      await interaction.reply('Spotify audio has been stopped.')
    }
  }
}