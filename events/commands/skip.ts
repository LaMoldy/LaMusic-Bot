import { Client } from "discord.js";
import { player } from "../..";
import { Command } from "../../utils/command";

export const Skip: Command = {
  name: "skip",
  description: "Skip a song!",
  run: async (client: Client, interaction: any) => {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    }

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "There seems to be no music being played",
      });
    const currentTrack = queue.current;
    const success = queue.skip();
    return await interaction.followUp({
      content: success
        ? `I have skipped ${currentTrack}`
        : "Looks like something went wrong",
    });
  },
};
