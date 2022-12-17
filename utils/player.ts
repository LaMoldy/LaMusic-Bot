import { Player, Track } from "discord-player";
import { Client } from "discord.js";

export function createPlayer(client: Client): Player {
  let player: Player = new Player(client);

  player.on("error", (queue: any, error: Error) => {
    console.log(
      `There was an error that came from the queue: ${error.message}`
    );
  });

  player.on("connectionError", (queue: any, error: Error) => {
    console.log(`Error came from the connection: ${error.message}`);
  });

  player.on("trackStart", (queue: any, track: Track) => {
    queue.me;
    queue.metadata.send(
      `I have started playing: ${track.title} in ${queue.connection.channel.name}`
    );
  });

  player.on("trackAdd", (queue: any, track: Track) => {
    queue.metadata.send(`I have queued the song: ${track.title}`);
  });

  player.on("botDisconnect", (queue: any) => {
    queue.metadata.send("I have been disconnected. I have destroyed the queue!");
  });

  player.on("channelEmpty", (queue: any) => {
    queue.metadata.send("There is currently no one in the voice channel");
  });

  player.on("queueEnd", (queue: any) => {
    queue.metadata.send("I have finished the queue");
  });

  return player;
}
