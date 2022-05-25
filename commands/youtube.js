const { SlashCommandBuilder } = require('@discordjs/builders');
const { channel } = require('diagnostics_channel');
const { Client, Interaction } = require('discord.js');

// DEBUG: https://www.youtube.com/watch?v=F64yFFnZfkI&list=RDF64yFFnZfkI&start_radio=1

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
            .setName('url')
            .setDescription('url for specified video audio')
        )
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('stop')
        .setDescription('Stops the YouTube audio from playing')
    ),
  async execute(interaction) {
    const ytdl = require('ytdl-core');
    const Discord = require('@discordjs/voice');
    const { joinVoiceChannel } = require('@discordjs/voice');

    const voiceChannel = interaction.member.voice.channel;

    let connection;

    if (interaction.options.getSubcommand() === 'play') {
      const url = interaction.options.getString('url');

      if (url) {
        const stream = ytdl(url, { filter: 'audioonly' });

        const player = Discord.createAudioPlayer(stream);
        const resource = Discord.createAudioResource(stream);

        if (voiceChannel == null) {
          await interaction.reply('You need to be in a VC to use this command.');
        }
        else {
          const permissions = voiceChannel.permissionsFor(interaction.client.user);

          if (!permissions.has('CONNECT')) {
            await interaction.reply('I need permission to join the voice chat.');
            return;
          }
          else if (!permissions.has('SPEAK')) {
            await interaction.reply('I need permission to speak in the voice chat');
            return;
          }
        }

        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        connection.subscribe(player);
        player.play(resource);

        player.on(Discord.AudioPlayerStatus.Idle, () => {
          connection.destroy();
        }); 

        player.on('error', error => {
          console.log(error);
          interaction.reply('Error with YouTube audio.');
        });

        await interaction.reply('Started playing YouTube URL: ' + url);
      }

      else {
        await interaction.reply('Please pass a url to start playing audio from YouTube.');
      }
    }
    
    if (interaction.options.getSubcommand() === 'stop') {
      connection.destroy();
      await interaction.reply('Audio has been stopped.');
    }
  }
}