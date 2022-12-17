import { Client } from "discord.js";
import { player } from "../..";
import { Command } from "../../utils/command";

export const Resume: Command = {
  name: "resume",
  description: "resumes the song",
  run: async (client: Client, interaction: any) => {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "You are not in a voice channel",
        ephemeral: true,
      });
    }

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.followUp({
        content: "There is currently no music is being played!",
      });
    const success = queue.setPaused(false);
    return await interaction.followUp({
      content: success
        ? "The song has been resumed"
        : "Looks like something went wrong",
    });
  },
};
