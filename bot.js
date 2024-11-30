require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Gérer les guildes
    GatewayIntentBits.GuildMembers, // Gérer les membres des guildes
    GatewayIntentBits.MessageContent, // Lire le contenu des messages
    GatewayIntentBits.GuildMessages, // Gérer les messages dans les guildes
    GatewayIntentBits.DirectMessages, // Gérer les messages privés
  ],
});

const adminChannelId = process.env.ADMIN_CHANNEL_ID; // Remplacez par l'ID de votre canal admin.

client.on("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    // Envoyer un DM au nouveau membre
    const dmChannel = await member.createDM();
    const questionMessage = await dmChannel.send(
      `Welcome on the serv **${member.guild.name}** ! Please share a screenshot of your game showing your name to make sure you are not a spy !!?`
    );

    // Attendre une réponse du membre
    const filter = (response) => response.author.id === member.id;
    const collected = await dmChannel.awaitMessages({
      filter,
      max: 1,
      errors: ["time"],
    });

    const response = collected.first();

    // Vérifier si la réponse contient une pièce jointe (image)
    if (response.attachments.size > 0) {
      const attachment = response.attachments.first();
      const adminChannel = member.guild.channels.cache.get(adminChannelId);
      if (adminChannel) {
        await adminChannel.send(
          `**New response from  ${member.user.tag} :**\nHere is the picture:`
        );
        await adminChannel.send({ files: [attachment.url] });
      } else {
        console.error("Canal admin introuvable");
      }
    } else {
      // Si la réponse est un texte
      const adminChannel = member.guild.channels.cache.get(adminChannelId);
      if (adminChannel) {
        await adminChannel.send(
          `**New response from ${member.user.tag} :**\n${response.content}`
        );
      } else {
        console.error("Canal admin introuvable");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la gestion du membre:", error);
  }
});

client.login(process.env.DISCORD_TOKEN); // Remplacez par votre vrai token
