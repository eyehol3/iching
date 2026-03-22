const { Telegraf, Markup } = require('telegraf');
const { validateInput, getReading } = require('./hexagram');
const { getIntro, getTitle, getHexFilename, getComFilename, getMovingLineTexts, getJudgment, getImage } = require('./content');
const { renderHexagram } = require('./renderer');

/**
 * Strip HTML tags (footnote superscripts etc.) from text.
 */
function stripHtml(text) {
  return text.replace(/<sup>[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '');
}

/**
 * Escape HTML entities.
 */
function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Convert markdown-style blockquote lines (> text) to HTML blockquote.
 */
function quoteToHtml(text) {
  const lines = stripHtml(text)
    .split('\n')
    .map(l => l.replace(/^>\s?/, '').trim())
    .filter(l => l.length > 0);
  return '<blockquote>' + lines.map(esc).join('\n\n') + '</blockquote>';
}

/**
 * Create and configure the Telegraf bot.
 */
function createBot(token, webappUrl) {
  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply(
      '☰ <b>The Book of Changes</b>\n\n' +
      'This is the I Ching — the ancient Chinese oracle.\n\n' +
      'To consult it:\n' +
      '1. Hold your question in mind\n' +
      '2. Toss three coins six times\n' +
      '3. Each toss: heads=3, tails=2 — add the values\n' +
      '4. Send me all six numbers as one string\n\n' +
      '<i>Example:</i> <code>789678</code> (bottom line first)\n\n' +
      'Each digit will be 6, 7, 8, or 9.\n' +
      'Use /how_to for the full guide.',
      { parse_mode: 'HTML' }
    );
  });

  bot.command('how_to', (ctx) => {
    const file = 'appendix-01-consulting-the-oracle';
    ctx.reply(
      '📖 Learn the coin oracle method:',
      Markup.inlineKeyboard([
        Markup.button.webApp('📖 On Consulting the Oracle', `${webappUrl}?file=${file}`)
      ])
    );
  });

  bot.on('text', (ctx) => {
    const input = ctx.message.text.trim();

    const validation = validateInput(input);
    if (!validation.valid) {
      ctx.reply(
        'That doesn\'t look like a coin toss result.\n\n' +
        'Send exactly 6 digits, each 6–9 (bottom line first).\n' +
        'Example: <code>789678</code>',
        { parse_mode: 'HTML' }
      );
      return;
    }

    const reading = getReading(input);
    const hexNum = reading.primary.number;
    const title = getTitle(hexNum);

    const ascii = renderHexagram(reading.lines, reading.primary);

    const parts = [];

    // Title
    parts.push('<b>' + esc(title) + '</b>');

    // ASCII hexagram in code block with ☯ label
    parts.push('<pre><code class="language-☯">' + esc(ascii) + '</code></pre>');

    // Intro (italic, stripped of HTML)
    const intro = getIntro(hexNum);
    if (intro) {
      parts.push('<i>' + esc(stripHtml(intro)) + '</i>');
    }

    // The Judgment
    const judgment = getJudgment(hexNum);
    if (judgment) {
      parts.push('<b>THE JUDGMENT</b>\n' + quoteToHtml(judgment));
    }

    // The Image
    const image = getImage(hexNum);
    if (image) {
      parts.push('<b>THE IMAGE</b>\n' + quoteToHtml(image));
    }

    // Changing lines
    if (reading.changingLines.length > 0) {
      const lineTexts = getMovingLineTexts(hexNum, reading.changingLines, reading.lines);
      if (lineTexts.length > 0) {
        const changingParts = ['<b>Changing lines:</b>'];
        for (const lt of lineTexts) {
          const ltLines = lt.split('\n');
          const header = ltLines[0].replace(/^#+\s*/, '');
          const oracleLines = ltLines.filter(l => l.startsWith('> ')).join('\n');
          changingParts.push('<b>' + esc(stripHtml(header)) + '</b>\n' + quoteToHtml(oracleLines));
        }
        parts.push(changingParts.join('\n\n'));
      }

      if (reading.secondary) {
        const secTitle = getTitle(reading.secondary.number);
        if (secTitle) {
          parts.push('⤷ Transforms into <b>' + esc(secTitle) + '</b>');
        }
      }
    }

    const message = parts.join('\n\n');

    const replyOpts = { parse_mode: 'HTML' };

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
          buttons.push(Markup.button.webApp('📖 ' + (getTitle(secNum)?.split('/')[0]?.trim() || 'Hex ' + secNum), `${webappUrl}?file=${secHexFile}`));
        }
        if (secComFile) {
          buttons.push(Markup.button.webApp('📝 ' + (getTitle(secNum)?.split('/')[0]?.trim() || 'Com ' + secNum), `${webappUrl}?file=${secComFile}`));
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
