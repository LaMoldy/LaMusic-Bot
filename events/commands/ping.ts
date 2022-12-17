import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "../../utils/command";

export const Ping: Command = {
  name: "ping",
  description: "returns pong my guy",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = "Pong!";

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
