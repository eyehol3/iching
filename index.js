require('dotenv').config();
const { loadContent } = require('./src/content');
const { createBot } = require('./src/bot');

// Validate required env vars
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || '';

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN environment variable is required.');
  console.error('Copy .env.example to .env and set your Telegram bot token.');
  process.exit(1);
}

if (!WEBAPP_URL) {
  console.warn('Warning: WEBAPP_URL is not set. WebApp buttons will not work.');
}

// Load I Ching content
loadContent();

// Start the bot
const bot = createBot(BOT_TOKEN, WEBAPP_URL);

bot.launch()
  .then(() => console.log('Bot is running.'))
  .catch((err) => {
    console.error('Failed to start bot:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
