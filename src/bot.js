const { Telegraf, Markup } = require('telegraf');
const { validateInput, getReading } = require('./hexagram');
const { getIntro, getTitle, getHexFilename, getComFilename, getMovingLineTexts, getJudgment, getImage } = require('./content');
const { renderHexagram } = require('./renderer');
const { locales, SUPPORTED_LANGS, DEFAULT_LANG } = require('./locales');

// Per-user language preference (userId → 'en' | 'ua')
const userLangs = new Map();

/**
 * Get user's language, auto-detecting from Telegram on first use.
 */
function getUserLang(ctx) {
  const userId = ctx.from?.id;
  if (!userId) return DEFAULT_LANG;

  if (userLangs.has(userId)) return userLangs.get(userId);

  // Auto-detect: Ukrainian Telegram users get Ukrainian
  const tgLang = ctx.from?.language_code || '';
  const lang = tgLang === 'uk' ? 'ua' : DEFAULT_LANG;
  userLangs.set(userId, lang);
  return lang;
}

function setUserLang(ctx, lang) {
  const userId = ctx.from?.id;
  if (userId) userLangs.set(userId, lang);
}

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
    const lang = getUserLang(ctx);
    const ui = locales[lang].ui;
    const otherLang = lang === 'en' ? 'ua' : 'en';
    const otherUi = locales[otherLang].ui;
    const buttons = [];
    if (webappUrl) {
      buttons.push([Markup.button.webApp(ui.jungForewordButton, `${webappUrl}?file=${lang}/00-foreword-jung`)]);
    }
    buttons.push([Markup.button.callback(otherUi.langSwitchLabel, `lang:${otherLang}`)]);
    ctx.reply(ui.startMessage, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons),
    });
  });

  bot.command('how_to', (ctx) => {
    const lang = getUserLang(ctx);
    const ui = locales[lang].ui;
    const file = `${lang}/appendix-01-consulting-the-oracle`;
    ctx.reply(
      ui.howToPrompt,
      Markup.inlineKeyboard([
        Markup.button.webApp(ui.howToButton, `${webappUrl}?file=${file}`)
      ])
    );
  });

  bot.command('lang', (ctx) => {
    const current = getUserLang(ctx);
    const currentUi = locales[current].ui;
    ctx.reply(
      currentUi.langSwitchLabel,
      Markup.inlineKeyboard([
        ...SUPPORTED_LANGS.map(l =>
          [Markup.button.callback(locales[l].ui.langSwitchLabel, `lang:${l}`)]
        ),
      ])
    );
  });

  for (const lang of SUPPORTED_LANGS) {
    bot.action(`lang:${lang}`, (ctx) => {
      setUserLang(ctx, lang);
      const ui = locales[lang].ui;
      const otherLang = lang === 'en' ? 'ua' : 'en';
      const otherUi = locales[otherLang].ui;
      const buttons = [];
      if (webappUrl) {
        buttons.push([Markup.button.webApp(ui.jungForewordButton, `${webappUrl}?file=${lang}/00-foreword-jung`)]);
      }
      buttons.push([Markup.button.callback(otherUi.langSwitchLabel, `lang:${otherLang}`)]);
      ctx.answerCbQuery(ui.langSet);
      ctx.editMessageText(ui.startMessage, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons),
      });
    });
  }

  bot.on('text', (ctx) => {
    const input = ctx.message.text.trim();
    const lang = getUserLang(ctx);
    const ui = locales[lang].ui;

    const validation = validateInput(input);
    if (!validation.valid) {
      ctx.reply(ui.invalidInput, { parse_mode: 'HTML' });
      return;
    }

    const reading = getReading(input);
    const hexNum = reading.primary.number;
    const title = getTitle(hexNum, lang);

    const ascii = renderHexagram(reading.lines, reading.primary, lang);

    const parts = [];

    // Title
    parts.push('<b>' + esc(title) + '</b>');

    // ASCII hexagram
    parts.push('<pre><code class="language-☯">' + esc(ascii) + '</code></pre>');

    // Intro
    const intro = getIntro(hexNum, lang);
    if (intro) {
      parts.push('<i>' + esc(stripHtml(intro)) + '</i>');
    }

    // Judgment
    const judgment = getJudgment(hexNum, lang);
    if (judgment) {
      parts.push('<b>' + esc(locales[lang].sectionHeaders.judgment) + '</b>\n' + quoteToHtml(judgment));
    }

    // Image
    const image = getImage(hexNum, lang);
    if (image) {
      parts.push('<b>' + esc(locales[lang].sectionHeaders.image) + '</b>\n' + quoteToHtml(image));
    }

    // Changing lines
    if (reading.changingLines.length > 0) {
      const lineTexts = getMovingLineTexts(hexNum, reading.changingLines, reading.lines, lang);
      if (lineTexts.length > 0) {
        const changingParts = ['<b>' + esc(ui.changingLines) + '</b>'];
        for (const lt of lineTexts) {
          const ltLines = lt.split('\n');
          const header = ltLines[0].replace(/^#+\s*/, '');
          const oracleLines = ltLines.filter(l => l.startsWith('> ')).join('\n');
          changingParts.push('<b>' + esc(stripHtml(header)) + '</b>\n' + quoteToHtml(oracleLines));
        }
        parts.push(changingParts.join('\n\n'));
      }

      if (reading.secondary) {
        const secTitle = getTitle(reading.secondary.number, lang);
        if (secTitle) {
          parts.push('⤷ ' + esc(ui.transformsInto) + ' <b>' + esc(secTitle) + '</b>');
        }
      }
    }

    const message = parts.join('\n\n');
    const replyOpts = { parse_mode: 'HTML' };

    if (webappUrl) {
      const buttons = [];
      const hexFile = getHexFilename(hexNum, lang);
      const comFile = getComFilename(hexNum, lang);

      if (hexFile) {
        buttons.push(Markup.button.webApp('📖 ' + ui.readChapter, `${webappUrl}?file=${lang}/${hexFile}`));
      }
      if (comFile) {
        buttons.push(Markup.button.webApp('📝 ' + ui.commentary, `${webappUrl}?file=${lang}/${comFile}`));
      }

      if (reading.secondary) {
        const secNum = reading.secondary.number;
        const secHexFile = getHexFilename(secNum, lang);
        const secComFile = getComFilename(secNum, lang);
        if (secHexFile) {
          buttons.push(Markup.button.webApp('📖 ' + (getTitle(secNum, lang)?.split('/')[0]?.trim() || 'Hex ' + secNum), `${webappUrl}?file=${lang}/${secHexFile}`));
        }
        if (secComFile) {
          buttons.push(Markup.button.webApp('📝 ' + (getTitle(secNum, lang)?.split('/')[0]?.trim() || 'Com ' + secNum), `${webappUrl}?file=${lang}/${secComFile}`));
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
