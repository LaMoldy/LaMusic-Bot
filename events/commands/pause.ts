import { Client } from "discord.js";
import { player } from "../..";
import { Command } from "../../utils/command";

export const Pause: Command = {
  name: "pause",
  description: "Pause current song!",
  run: async (client: Client, interaction: any) => {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "You are currently not in a voice channel!",
        ephemeral: true,
      });
    }

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.followUp({
        content: "There is currently no music is being played!",
      });
    const success = queue.setPaused(true);
    return await interaction.followUp({
      content: success
        ? "Music has been paused"
        : "Looks like something went wrong",
    });
  },
};
