require("dotenv").config();
const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  Partials, 
  ChannelType 
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

const adminRoleName = "Discord Admin"; // Adjust this to match your admin role name
const BotRoleName = "BOTS"
const welcomeMessage = `
**English:** Welcome on the server ! Please share a screenshot of your game showing your name to make sure you are not a spy!

**Français:** Bienvenue sur le serveur ! Veuillez partager une capture d'écran de votre jeu montrant votre nom pour vérifier que vous n'êtes pas un espion !

**Deutsch:** Willkommen auf dem Server ! Bitte teile einen Screenshot deines Spiels, der deinen Namen zeigt, um sicherzustellen, dass du kein Spion bist!

**Русский:** Добро пожаловать на сервер ! Пожалуйста, отправьте скриншот вашей игры, на котором видно ваше имя, чтобы убедиться, что вы не шпион!

**Español:** ¡Bienvenido al servidor ! ¡Por favor comparte una captura de pantalla de tu juego mostrando tu nombre para asegurarte de que no eres un espía!

**中文:** 歡迎來到伺服器 ！請分享一張顯示你名字的遊戲截圖，以確保你不是間諜！

**Italiano:** Benvenuto nel server ! Per favore, condividi uno screenshot del tuo gioco che mostra il tuo nome per essere sicuro che non sei una spia!
`;
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    const guild = member.guild;

    // Find the admin role
    const adminRole = guild.roles.cache.find((role) => role.name === adminRoleName);
    const botRole = guild.roles.cache.find((role) => role.name === BotRoleName);
    if (!adminRole) {
      console.error(`Admin role "${adminRoleName}" not found.`);
      return;
    }

    // Create the private verification channel
    const privateChannel = await guild.channels.create({
      name: `verification-${member.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel], // Deny access to everyone
        },
        {
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ], // Allow the user to view and send messages
        },
        {
          id: adminRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel], // Allow Admins to view the channel
        },
        {
          id: botRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel], // Allow Admins to view the channel
        },
      ],
    });

    // Send the welcome message in the private channel
    await privateChannel.send(`${member}, welcome! ${welcomeMessage}`);
  } catch (error) {
    console.error("Error handling new member verification:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
