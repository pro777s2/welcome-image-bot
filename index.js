// 🔧 FORCE IPV4 (fixes Windows + Discord CDN issues)
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');

// 🔧 CONFIG
const WELCOME_CHANNEL_ID = '1469938285827592323';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🟢 READY
client.once('ready', () => {
  console.log(`🟢 Bot online as ${client.user.tag}`);
});

// 🧪 TEST COMMAND
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content !== '!testwelcome') return;

  await safeWelcome(message.author, message.guild);
});

// 👤 AUTO WELCOME
client.on('guildMemberAdd', async (member) => {
  console.log(`👤 New member joined: ${member.user.tag}`);
  await safeWelcome(member.user, member.guild);
});

// 🛡️ SAFE WRAPPER
async function safeWelcome(user, guild) {
  try {
    await sendWelcomeImage(user, guild);
  } catch (err) {
    console.error('⚠️ Welcome failed (ignored):', err.message);
  }
}

// 🖼️ IMAGE FUNCTION
async function sendWelcomeImage(user, guild) {
  const channel = guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const canvas = Canvas.createCanvas(800, 450);
  const ctx = canvas.getContext('2d');

  // Background
  const background = await Canvas.loadImage('./welcome.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Avatar
  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ extension: 'png', size: 256 })
  );

  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 190, 70, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 330, 120, 140, 140);
  ctx.restore();

  const username = user.username;

  // ✨ NEON USERNAME BELOW AVATAR
  ctx.font = 'bold 34px Arial';
  ctx.textAlign = 'center';

  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#00ffff';
  ctx.fillText(username, 400, 300);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(username, 400, 300);

  // 🔥 MAIN TEXT (BOTTOM)
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Welcome to the ART OF CURSE!!!', 400, 420);

  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'welcome.png'
  });

  // 🚀 SEND MESSAGE
  await channel.send({
    content: `🔥 Vanga bro <@${user.id}> ethu nama ART OF CURSE!!!`,
    files: [attachment]
  });
}

// 🔐 LOGIN
client.login(process.env.BOT_TOKEN);

// 🛑 NEVER CRASH
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled rejection (ignored):', err.message);
});