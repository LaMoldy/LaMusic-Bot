import { createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { joinVoiceChannel } from '@discordjs/voice'; 

export default class UtilAudioPlayer {
  static join(voiceChannel) {
    return joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
  }

  static play(player, connection, stream) {
    let resource = createAudioResource(stream.stream, { inputType: stream.type });
    
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
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