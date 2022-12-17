import { Client } from "discord.js";
import { player } from "../..";
import { Command } from "../../utils/command";

export const Stop: Command = {
  name: "stop",
  description: "Stop all songs in the queue!",
  run: async (client: Client, interaction: any) => {
    if (!interaction.member.voice.channel) {
      return interaction.followUp({
        content: "You must be in a voice chat",
        ephemeral: true,
      });
    }

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.followUp({
        content: " There is currently no music is being played!",
      });
    queue.destroy();
    return await interaction.followUp({
      content: "Stopped the player!",
    });
  },
};
