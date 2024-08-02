import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "./config.js";

const commands = [
  new SlashCommandBuilder()
    .setName("giveroles")
    .setDescription(
      "Assign roles for channel access. Your Discord account must be linked on the VATUSA website."
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
