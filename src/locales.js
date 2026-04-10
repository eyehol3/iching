/**
 * Locale definitions for English and Ukrainian.
 * Contains all translatable strings, patterns, and metadata.
 */

const locales = {
  en: {
    // ── Content parsing ──
    sectionHeaders: {
      judgment: 'THE JUDGMENT',
      image: 'THE IMAGE',
    },
    linePatterns: {
      valueWords: { 9: 'Nine', 6: 'Six' },
      positionPhrases: [
        'at the beginning',
        'in the second place',
        'in the third place',
        'in the fourth place',
        'in the fifth place',
        'at the top',
      ],
    },

    // ── Trigram display names ──
    trigrams: {
      '111': { name: "Ch'ien", attribute: 'The Creative, Heaven' },
      '100': { name: 'Chên',   attribute: 'The Arousing, Thunder' },
      '010': { name: "K'an",   attribute: 'The Abysmal, Water' },
      '001': { name: 'Kên',    attribute: 'Keeping Still, Mountain' },
      '000': { name: "K'un",   attribute: 'The Receptive, Earth' },
      '011': { name: 'Sun',    attribute: 'The Gentle, Wind' },
      '101': { name: 'Li',     attribute: 'The Clinging, Fire' },
      '110': { name: 'Tui',    attribute: 'The Joyous, Lake' },
    },

    // ── Renderer ──
    renderer: {
      above: 'above',
      below: 'below',
    },

    // ── Bot UI ──
    ui: {
      bookTitle: 'The Book of Changes',
      startMessage:
        '☰ <b>The Book of Changes</b>\n\n' +
        'This is the I Ching — the ancient Chinese oracle.\n\n' +
        'To consult it:\n' +
        '1. Hold your question in mind\n' +
        '2. Toss three coins six times\n' +
        '3. Each toss: heads=3, tails=2 — add the values\n' +
        '4. Send me all six numbers as one string\n\n' +
        '<i>Example:</i> <code>789678</code> (bottom line first)\n\n' +
        'Each digit will be 6, 7, 8, or 9.\n' +
        'Use /how_to for the full guide.\n\n' +
        'I highly recommend reading Carl Jung\'s foreword!',
      jungForewordButton: '📖 Jung\'s Foreword',
      invalidInput:
        'That doesn\'t look like a coin toss result.\n\n' +
        'Send exactly 6 digits, each 6–9 (bottom line first).\n' +
        'Example: <code>789678</code>',
      changingLines: 'Changing lines:',
      transformsInto: 'Transforms into',
      readChapter: 'Read Chapter',
      commentary: 'Commentary',
      howToPrompt: '📖 Learn the coin oracle method:',
      howToButton: '📖 On Consulting the Oracle',
      langSwitchLabel: '🇬🇧 English',
      langPrompt: '🌐 Choose your language:',
      langSet: 'Language set to English.',
    },

  },

  ua: {
    // ── Content parsing ──
    sectionHeaders: {
      judgment: 'СУДЖЕННЯ',
      image: 'ОБРАЗ',
    },
    linePatterns: {
      valueWords: { 9: "Дев'ятка", 6: 'Шістка' },
      positionPhrases: [
        'на початку',
        'на другому місці',
        'на третьому місці',
        'на четвертому місці',
        "на п'ятому місці",
        'нагорі',
      ],
    },

    // ── Trigram display names ──
    trigrams: {
      '111': { name: 'Цянь',  attribute: 'Творче, Небо' },
      '100': { name: 'Чень',  attribute: 'Збуджувальне, Грім' },
      '010': { name: 'Кань',  attribute: 'Безодня, Вода' },
      '001': { name: 'Кень',  attribute: 'Непорушне, Гора' },
      '000': { name: 'Кунь',  attribute: 'Сприймальне, Земля' },
      '011': { name: 'Сунь',  attribute: 'Лагідне, Вітер' },
      '101': { name: 'Лі',    attribute: 'Чіпке, Вогонь' },
      '110': { name: 'Туй',   attribute: 'Радісне, Озеро' },
    },

    // ── Renderer ──
    renderer: {
      above: 'вгорі',
      below: 'внизу',
    },

    // ── Bot UI ──
    ui: {
      bookTitle: 'Книга Змін',
      startMessage:
        '☰ <b>Книга Змін</b>\n\n' +
        'Це І Цзін — стародавній китайський оракул.\n\n' +
        'Щоб звернутися до нього:\n' +
        '1. Тримайте своє питання в думках\n' +
        '2. Підкиньте три монети шість разів\n' +
        '3. Кожен кидок: орел=3, решка=2 — додайте значення\n' +
        '4. Надішліть мені всі шість цифр одним рядком\n\n' +
        '<i>Приклад:</i> <code>789678</code> (нижня лінія першою)\n\n' +
        'Кожна цифра буде 6, 7, 8 або 9.\n' +
        'Використайте /how_to для повної інструкції.\n\n' +
        'Дуже рекомендую прочитати вступ Карла Юнга!',
      jungForewordButton: '📖 Вступ Юнга',
      invalidInput:
        'Це не схоже на результат кидання монет.\n\n' +
        'Надішліть рівно 6 цифр, кожна 6–9 (нижня лінія першою).\n' +
        'Приклад: <code>789678</code>',
      changingLines: 'Мінливі лінії:',
      transformsInto: 'Перетворюється на',
      readChapter: 'Читати розділ',
      commentary: 'Коментар',
      howToPrompt: '📖 Метод монетного оракула:',
      howToButton: '📖 Про консультування з оракулом',
      langSwitchLabel: '🇺🇦 Українська',
      langPrompt: '🌐 Оберіть мову:',
      langSet: 'Мову змінено на українську.',
    },
  },
};

/**
 * Build a regex pattern to match a line header in markdown.
 * @param {object} locale - locale object (locales.en or locales.ua)
 * @param {number} position - 1-based line position (1=bottom, 6=top)
 * @param {number} lineValue - 6 or 9
 * @returns {RegExp}
 */
function buildLinePattern(locale, position, lineValue) {
  const valueWord = locale.linePatterns.valueWords[lineValue];
  const posPhrase = locale.linePatterns.positionPhrases[position - 1];
  return new RegExp(`^####\\s+${valueWord}\\s+${posPhrase}`, 'im');
}

const SUPPORTED_LANGS = ['en', 'ua'];
const DEFAULT_LANG = 'en';

module.exports = { locales, buildLinePattern, SUPPORTED_LANGS, DEFAULT_LANG };
