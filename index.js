require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

const adminChannelId = process.env.ADMIN_CHANNEL_ID;

// Message contenant toutes les langues avec {server} comme placeholder
const welcomeMessage = `
**English:** Welcome on the server **{server}**! Please share a screenshot of your game showing your name to make sure you are not a spy!

**Français:** Bienvenue sur le serveur **{server}** ! Veuillez partager une capture d'écran de votre jeu montrant votre nom pour vérifier que vous n'êtes pas un espion !

**Deutsch:** Willkommen auf dem Server **{server}**! Bitte teile einen Screenshot deines Spiels, der deinen Namen zeigt, um sicherzustellen, dass du kein Spion bist!

**Русский:** Добро пожаловать на сервер **{server}**! Пожалуйста, отправьте скриншот вашей игры, на котором видно ваше имя, чтобы убедиться, что вы не шпион!

**Español:** ¡Bienvenido al servidor **{server}**! ¡Por favor comparte una captura de pantalla de tu juego mostrando tu nombre para asegurarte de que no eres un espía!

**中文:** 歡迎來到伺服器 **{server}**！請分享一張顯示你名字的遊戲截圖，以確保你不是間諜！

**Italiano:** Benvenuto nel server **{server}**! Per favore, condividi uno screenshot del tuo gioco che mostra il tuo nome per essere sicuro che non sei una spia!
`;

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    // Replace {server} with the actual guild name
    const formattedMessage = welcomeMessage.replace(
      /{server}/g,
      member.guild.name
    );

    // Send the welcome message to the new member's DM
    const dmChannel = await member.createDM();
    await dmChannel.send(formattedMessage);

    // Wait for a response
    const filter = (response) => response.author.id === member.id;
    const collected = await dmChannel.awaitMessages({
      filter,
      max: 1,
      errors: ["time"],
    });

    const response = collected.first();
    const adminChannel = member.guild.channels.cache.get(adminChannelId);

    // Handle the user's response
    if (response.attachments.size > 0) {
      const attachment = response.attachments.first();
      if (adminChannel) {
        await adminChannel.send(
          `**New response from ${member.user.tag}:**\nHere is the picture:`
        );
        await adminChannel.send({ files: [attachment.url] });
      }
    } else if (adminChannel) {
      await adminChannel.send(
        `**New response from ${member.user.tag}:**\n${response.content}`
      );
    }
  } catch (error) {
    console.error("Error handling new member:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
