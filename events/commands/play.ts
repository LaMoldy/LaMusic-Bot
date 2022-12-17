import { QueryType, Queue } from "discord-player";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
} from "discord.js";
import { player } from "../..";
import { Command } from "../../utils/command";
require("dotenv").config();

export const Play: Command = {
  name: "play",
  description: "Play a song",
  options: [
    {
      name: "song",
      type: ApplicationCommandOptionType.String,
      description: "The song you want played",
      required: true,
    },
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: any) => {
    let queue: Queue;
    try {
      if (!interaction.member.voice.channel) {
        return interaction.reply({
          content: "You are not in a voice channel!",
          ephermal: true,
        });
      }

      const searchedSong = interaction.options.getString("song");
      const searchResult = await player
        .search(searchedSong, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});

      if (!searchResult || !searchResult.tracks.length) {
        return await interaction.reply({
          content: "No results found",
        });
      }

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
          quality: "highest",
          filter: "audioonly",
          highWaterMark: 1 << 30,
          dlChunkSize: 0,
        },
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection) {
          await queue.connect(interaction.member.voice.channel);
        }
      } catch {
        void player.deleteQueue(interaction.guildId);
        return await interaction.reply({
          content: "Could not join your voice channel",
        });
      }

      await interaction.followUp({
        content: `Loading your ${
          searchResult.playlist ? "playlist" : "track"
        }...`,
      });

      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content:
          "There was an error trying to execute the command: " + error.message,
      });
    }
  },
};
