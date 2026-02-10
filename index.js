// 🔧 Force IPv4 (important for Railway + Discord)
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const path = require("path");

// ================= CONFIG =================
const WELCOME_CHANNEL_ID = "1469938285827592323";

// ================= DISCORD CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ================= REGISTER FONTS =================
Canvas.registerFont(
  path.join(__dirname, "fonts", "Orbitron-Bold.ttf"),
  { family: "Orbitron" }
);

// ================= READY =================
client.once("ready", () => {
  console.log(`🟢 Bot online as ${client.user.tag}`);
});

// ================= TEST COMMAND =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content !== "!testwelcome") return;

  sendWelcomeImage(message.author, message.guild);
});

// ================= AUTO WELCOME =================
client.on("guildMemberAdd", async (member) => {
  sendWelcomeImage(member.user, member.guild);
});

// ================= MAIN IMAGE FUNCTION =================
async function sendWelcomeImage(user, guild) {
  try {
    const channel = guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    const canvas = Canvas.createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    // ---------- BACKGROUND ----------
    const background = await Canvas.loadImage("./welcome.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // ---------- AVATAR ----------
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ extension: "png", size: 256 })
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(400, 195, 70, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 330, 125, 140, 140);
    ctx.restore();

    // =================================================
    // 🔥 USERNAME (NEON STRONG)
    // =================================================
    ctx.textAlign = "center";
    ctx.font = "bold 42px Orbitron";

    // Strong glow
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 35;
    ctx.fillStyle = "#00ffff";
    ctx.fillText(user.username, 400, 300);

    // Sharp core
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(user.username, 400, 300);

    // =================================================
    // 🔥 WELCOME TEXT (DIFFERENT FONT STYLE)
    // =================================================
    const welcomeText = "WELCOME TO THE ART OF CURSE!!!";

    ctx.font = "bold 34px Arial Black"; // different font
    ctx.textAlign = "center";

    // VERY STRONG NEON
    ctx.shadowColor = "#ff0055";
    ctx.shadowBlur = 45;
    ctx.fillStyle = "#ff0055";
    ctx.fillText(welcomeText, 400, 385); // LOWER POSITION ✅

    // Sharp layer
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(welcomeText, 400, 385);

    // ---------- SEND ----------
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "welcome.png",
    });

    await channel.send({
      content: `🔥 Vanga bro <@${user.id}> ethu nama ART OF CURSE!!! 💀`,
      files: [attachment],
    });
  } catch (err) {
    console.error("⚠️ Welcome image failed:", err.message);
  }
}

// ================= LOGIN =================
client.login(process.env.BOT_TOKEN);

// ================= SAFETY =================
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled rejection:", err);
});
