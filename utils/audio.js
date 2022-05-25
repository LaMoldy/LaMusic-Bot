const Discord = require('@discordjs/voice');
const { joinVoiceChannel} = require('@discordjs/voice'); 

class UtilAudioPlayer {
  static join(voiceChannel) {
    return joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
  }

  static play(player, connection, stream) {
    let resource = Discord.createAudioResource(stream.stream, { inputType: stream.type });
    
    player.play(resource);
    connection.subscribe(player);

    player.on(Discord.AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    player.on('error', error => {
      console.log(error);
    });
  }

  static stop(connection) {
    connection.destroy();
  }
}

module.exports = UtilAudioPlayer;