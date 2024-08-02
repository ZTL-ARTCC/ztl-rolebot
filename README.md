# ZTL Discord Role Bot

Discord bot for the official ZTL Discord. Based on the VATUSA bot.

How to run:

1. Create a .env file in the root directory with the contents found in .env.example
2. Install dependencies with `npm install`
3. Register commands with `npm run register` (Only needs to be done once)
4. Run `npm start`

Serverside endpoint: `/assignRoles?user=userId` where userId is the Discord ID of the user to assign roles to.
