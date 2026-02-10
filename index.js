// 🔧 FORCE IPV4 (fixes Cloudflare / CDN timeout on Railway & Windows)
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

// 🔧 CONFIG
const WELCOME_CHANNEL_ID = '1469938285827592323'; // <-- your channel ID

// 🤖 DISCORD CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🟢 READY
client.once('ready', () => {
  console.log(`🟢 Bot online as ${client.user.tag}`);
});

// 👤 AUTO WELCOME
client.on('guildMemberAdd', async (member) => {
  try {
    await sendWelcomeImage(member);
  } catch (err) {
    console.error('⚠️ Welcome failed:', err.message);
  }
});

// 🖼️ IMAGE FUNCTION
async function sendWelcomeImage(member) {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  // 🎨 REGISTER FONT (IMPORTANT)
  Canvas.registerFont(
    path.join(__dirname, 'fonts', 'Orbitron-Bold.ttf'),
    { family: 'Orbitron' }
  );

  const canvas = Canvas.createCanvas(800, 450);
  const ctx = canvas.getContext('2d');

  // 🖼️ BACKGROUND
  const background = await Canvas.loadImage(
    path.join(__dirname, 'welcome.png')
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // 👤 AVATAR
  const avatarURL = member.user.displayAvatarURL({
    extension: 'png',
    size: 256
  });
  const avatar = await Canvas.loadImage(avatarURL);

  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 190, 70, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 330, 120, 140, 140);
  ctx.restore();

  // ✨ USERNAME (NEON EFFECT)
  const username = member.user.username;

  ctx.textAlign = 'center';
  ctx.font = 'bold 38px Orbitron';

  // Glow
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#00ffff';
  ctx.fillText(username, 400, 310);

  // Sharp text
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(username, 400, 310);

  // 📝 WELCOME TEXT
  ctx.font = 'bold 30px Orbitron';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    'Welcome to the ART OF CURSE!!!',
    400,
    360
  );

  // 📦 SEND IMAGE
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'welcome.png'
  });

  await channel.send({
    content: `🔥 Vanga bro <@${member.id}> ethu nama ART OF CURSE!!! 💀`,
    files: [attachment]
  });
}

// 🔐 LOGIN (Railway Environment Variable)
client.login(process.env.BOT_TOKEN);

// 🛑 SAFETY (never crash Railway)
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled rejection:', err);
});
