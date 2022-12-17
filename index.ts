import { Player } from "discord-player";
import { Client, GatewayIntentBits } from "discord.js";
import interactionCreate from "./events/interactionCreate";
import ready from "./events/ready";
import { createPlayer } from "./utils/player";

require("dotenv").config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

ready(client);
interactionCreate(client);

export const player: Player = createPlayer(client);

// Logins in bot based on the environtment
if (process.env.ENVIRONMEN === "prod") {
  client.login(process.env.PROD_TOKEN);
} else {
  client.login(process.env.DEV_TOKEN);
}
