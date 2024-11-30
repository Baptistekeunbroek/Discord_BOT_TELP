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

const messages = {
  en: "Welcome on the server **${server}**! Please share a screenshot of your game showing your name to make sure you are not a spy!",
  fr: "Bienvenue sur le serveur **${server}** ! Veuillez partager une capture d'écran de votre jeu montrant votre nom pour vérifier que vous n'êtes pas un espion !",
  de: "Willkommen auf dem Server **${server}**! Bitte teile einen Screenshot deines Spiels, der deinen Namen zeigt, um sicherzustellen, dass du kein Spion bist!",
  ru: "Добро пожаловать на сервер **${server}**! Пожалуйста, отправьте скриншот вашей игры, на котором видно ваше имя, чтобы убедиться, что вы не шпион!",
  uk: "Ласкаво просимо на сервер **${server}**! Будь ласка, поділіться скріншотом вашої гри, на якому видно ваше ім'я, щоб переконатися, що ви не шпигун!",
  es: "¡Bienvenido al servidor **${server}**! ¡Por favor comparte una captura de pantalla de tu juego mostrando tu nombre para asegurarte de que no eres un espía!",
  pt: "Bem-vindo ao servidor **${server}**! Por favor, compartilhe uma captura de tela do seu jogo mostrando seu nome para ter certeza de que você não é um espião!",
  zh_TW:
    "歡迎來到伺服器 **{guildName}**！請分享一張顯示你名字的遊戲截圖，以確保你不是間諜！！",
  it: "Benvenuto nel server **{guildName}**! Per favore, condividi uno screenshot del tuo gioco che mostra il tuo nome per essere sicuro che non sei una spia!!",
};

// Crée un serveur Express
const app = express();
const port = process.env.PORT || 3000; // Utilise le port dynamique ou 3000 par défaut

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
    // Récupérer la langue de l'utilisateur
    const userLocale = member.preferredLocale || "en"; // Par défaut en anglais

    // Sélectionner le message basé sur la langue de l'utilisateur
    const questionMessage =
      messages[userLocale]?.replace("${server}", member.guild.name) ||
      messages.en;

    // Envoyer le message dans le DM
    const dmChannel = await member.createDM();
    await dmChannel.send(questionMessage);

    // Attendre une réponse
    const filter = (response) => response.author.id === member.id;
    const collected = await dmChannel.awaitMessages({
      filter,
      max: 1,
      errors: ["time"],
    });

    const response = collected.first();

    // Vérifier la réponse
    if (response.attachments.size > 0) {
      const attachment = response.attachments.first();
      const adminChannel = member.guild.channels.cache.get(adminChannelId);
      if (adminChannel) {
        await adminChannel.send(
          `**New response from  ${member.user.tag} :**\nHere is the picture:`
        );
        await adminChannel.send({ files: [attachment.url] });
      } else {
        console.error("Admin channel not found");
      }
    } else {
      const adminChannel = member.guild.channels.cache.get(adminChannelId);
      if (adminChannel) {
        await adminChannel.send(
          `**New response from ${member.user.tag} :**\n${response.content}`
        );
      } else {
        console.error("Admin channel not found");
      }
    }
  } catch (error) {
    console.error("Error handling new member:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
