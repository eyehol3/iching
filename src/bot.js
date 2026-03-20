const { Telegraf, Markup } = require('telegraf');
const { validateInput, getReading } = require('./hexagram');
const { getIntro, getTitle, getHexFilename, getComFilename, getMovingLineTexts } = require('./content');
const { renderReading } = require('./renderer');

/**
 * Create and configure the Telegraf bot.
 * @param {string} token - Telegram bot token
 * @param {string} webappUrl - Base URL of the web reader
 * @returns {Telegraf}
 */
function createBot(token, webappUrl) {
  const bot = new Telegraf(token);

  // /start — welcome message
  bot.start((ctx) => {
    ctx.reply(
      '☰ *The Book of Changes*\n\n' +
      'This is the I Ching — the ancient Chinese oracle.\n\n' +
      'To consult it:\n' +
      '1. Hold your question in mind\n' +
      '2. Toss three coins six times\n' +
      '3. Each toss: heads=3, tails=2 — add the values\n' +
      '4. Send me all six numbers as one string\n\n' +
      '_Example:_ `789678` (bottom line first)\n\n' +
      'Each digit will be 6, 7, 8, or 9.\n' +
      'Use /how\\_to for the full guide.',
      { parse_mode: 'Markdown' }
    );
  });

  // /how_to — link to "On Consulting the Oracle"
  bot.command('how_to', (ctx) => {
    const file = 'appendix-01-consulting-the-oracle';
    ctx.reply(
      '📖 Learn the coin oracle method:',
      Markup.inlineKeyboard([
        Markup.button.webApp('📖 On Consulting the Oracle', `${webappUrl}?file=${file}`)
      ])
    );
  });

  // Text message handler — coin-toss input
  bot.on('text', (ctx) => {
    const input = ctx.message.text.trim();

    // Validate
    const validation = validateInput(input);
    if (!validation.valid) {
      ctx.reply(
        '🪙 That doesn\'t look like a coin toss result.\n\n' +
        'Send exactly 6 digits, each 6–9 (bottom line first).\n' +
        'Example: `789678`',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // Get the reading
    const reading = getReading(input);
    const hexNum = reading.primary.number;

    // Build the ASCII hexagram
    const ascii = renderReading(reading);

    // Get the intro paragraph
    const intro = getIntro(hexNum);
    const title = getTitle(hexNum);

    // Build the message
    let message = '```\n' + ascii + '\n```\n\n';
    if (intro) {
      message += intro;
    }

    // Add moving line texts if applicable
    if (reading.changingLines.length > 0) {
      const lineTexts = getMovingLineTexts(hexNum, reading.changingLines, reading.lines);
      if (lineTexts.length > 0) {
        message += '\n\n---\n*Changing lines:*\n\n';
        for (const lt of lineTexts) {
          // Extract just the quoted oracle text from each line text
          const oracleLines = lt.split('\n').filter(l => l.startsWith('> ')).join('\n');
          const header = lt.split('\n')[0];
          message += `*${header.replace(/^#+\s*/, '')}*\n${oracleLines}\n\n`;
        }
      }

      // Add second hexagram intro
      if (reading.secondary) {
        const secTitle = getTitle(reading.secondary.number);
        const secIntro = getIntro(reading.secondary.number);
        if (secTitle || secIntro) {
          message += '---\n*⤷ ' + (secTitle || '') + '*\n\n';
          if (secIntro) message += secIntro;
        }
      }
    }

    // Build WebApp buttons (only if WEBAPP_URL is configured)
    const replyOpts = { parse_mode: 'Markdown' };

    if (webappUrl) {
      const buttons = [];
      const hexFile = getHexFilename(hexNum);
      const comFile = getComFilename(hexNum);

      if (hexFile) {
        buttons.push(Markup.button.webApp('📖 Read Chapter', `${webappUrl}?file=${hexFile}`));
      }
      if (comFile) {
        buttons.push(Markup.button.webApp('📝 Commentary', `${webappUrl}?file=${comFile}`));
      }

      if (reading.secondary) {
        const secNum = reading.secondary.number;
        const secHexFile = getHexFilename(secNum);
        const secComFile = getComFilename(secNum);
        if (secHexFile) {
          buttons.push(Markup.button.webApp(`📖 ${getTitle(secNum)?.split('/')[0]?.trim() || 'Hex ' + secNum}`, `${webappUrl}?file=${secHexFile}`));
        }
        if (secComFile) {
          buttons.push(Markup.button.webApp(`📝 ${getTitle(secNum)?.split('/')[0]?.trim() || 'Com ' + secNum}`, `${webappUrl}?file=${secComFile}`));
        }
      }

      const keyboard = [];
      for (let i = 0; i < buttons.length; i += 2) {
        keyboard.push(buttons.slice(i, i + 2));
      }
      Object.assign(replyOpts, Markup.inlineKeyboard(keyboard));
    }

    ctx.reply(message, replyOpts);
  });

  return bot;
}

module.exports = { createBot };
