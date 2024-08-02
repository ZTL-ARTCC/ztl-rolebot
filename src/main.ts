import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { BOT_TOKEN, GUILD_ID, PORT } from "./config.js";
import { addRoles } from "./commands.js";
import express from "express";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(BOT_TOKEN);

const guild = await client.guilds.fetch(GUILD_ID);

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const member = guild?.members.cache.get(
    interaction.member?.user.id as string
  ) as GuildMember;
  if (interaction.commandName === "giveroles") {
    await addRoles(member, guild, interaction);
  }
});

const app = express();

// /assignRoles?userId=
app.get("/assignRoles", async (req, res) => {
  const userId = req.query.userId as string;
  if (!guild) {
    res.status(400).send({
      status: 400,
      message: "Error fetching guild.",
    });
    return;
  }
  if (userId) {
    const member = await guild.members.fetch(userId);
    if (!member) {
      res.status(404).send({
        status: 404,
        message: "You are not a member of the ZTL ARTCC Discord.",
      });
      return;
    }
    await addRoles(member, guild)
      .then((embed) => {
        res.status(embed?.status || 500).send({
          status: embed?.status,
          message: embed?.message,
        });
      })
      .catch((err) => {
        res.status(500).send({
          status: 500,
          message: `Error adding roles: ${err}`,
        });
      });
  } else {
    res.status(400).send({
      status: 400,
      message: `Missing query parameter 'userId'`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
