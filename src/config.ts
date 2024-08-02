import { config } from "dotenv";

config();

const BOT_TOKEN = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : "";
const CLIENT_ID = process.env.CLIENT_ID ? process.env.CLIENT_ID : "";
const GUILD_ID = process.env.GUILD_ID ? process.env.GUILD_ID : "";
const API_URL = process.env.API_URL ? process.env.API_URL : "";
const PORT = process.env.PORT ? process.env.PORT : 3000;

export { BOT_TOKEN, CLIENT_ID, GUILD_ID, API_URL, PORT };
