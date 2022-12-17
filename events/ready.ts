import { Client, PresenceUpdateStatus } from "discord.js";
import { Commands } from "../utils/commands";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    client.user.setPresence({
      activities: [
        {
          name: "Listening to music",
          type: 1,
        },
      ],
      status: PresenceUpdateStatus.Online,
    });

    await client.application.commands.set(Commands);

    console.log(`${client.user.username} is online`);
  });
};
