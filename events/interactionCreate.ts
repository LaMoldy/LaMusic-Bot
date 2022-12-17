import { ChatInputCommandInteraction, Client } from "discord.js";
import { Commands } from "../utils/commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: any) => {
    if (interaction.isCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: any
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply();

  slashCommand.run(client, interaction);
};
