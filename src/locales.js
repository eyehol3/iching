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
      '110': { name: 'Li',     attribute: 'The Clinging, Fire' },
      '101': { name: 'Tui',    attribute: 'The Joyous, Lake' },
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
        'Use /how_to for the full guide.',
      invalidInput:
        'That doesn\'t look like a coin toss result.\n\n' +
        'Send exactly 6 digits, each 6–9 (bottom line first).\n' +
        'Example: <code>789678</code>',
      theJudgment: 'THE JUDGMENT',
      theImage: 'THE IMAGE',
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

    // ── Web reader ──
    web: {
      title: 'I Ching',
      subtitle: 'The Book of Changes',
      loading: 'Loading',
      contents: 'Contents',
      previous: '← Previous',
      next: 'Next →',
      errorLoad: 'Could not load chapter.',
      langToggleLabel: 'Українська',
      sections: {
        frontMatter: 'Front Matter',
        bookI: 'Book I — The Text',
        bookII: 'Book II — The Material',
        bookIII: 'Book III — The Commentaries',
        appendixes: 'Appendixes',
      },
      frontMatter: [
        { title: 'Preface to the Third Edition', file: '00-preface-hellmut-wilhelm' },
        { title: 'The Major Divisions of the Material', file: '00-major-divisions' },
        { title: 'Foreword by C.\u2009G. Jung', file: '00-foreword-jung' },
        { title: 'Translator\u2019s Note', file: '00-translators-note' },
        { title: 'Preface by Richard Wilhelm', file: '00-preface-richard-wilhelm' },
        { title: 'Introduction', file: '00-introduction' },
      ],
      book2: [
        { title: 'Introduction to Book II', file: 'book2-00-introduction' },
        { title: 'Shuo Kua: Discussion of the Trigrams', file: 'book2-01-shuo-kua' },
        { title: 'Ta Chuan: The Great Treatise', file: 'book2-02-ta-chuan' },
        { title: 'The Structure of the Hexagrams', file: 'book2-03-structure-of-hexagrams' },
      ],
      appendixes: [
        { title: 'On Consulting the Oracle', file: 'appendix-01-consulting-the-oracle' },
        { title: 'The Hexagrams by Houses', file: 'appendix-02-hexagrams-by-houses' },
        { title: 'Notes', file: 'appendix-03-notes' },
      ],
      hexNames: [
        ["Ch'ien","The Creative"],["K'un","The Receptive"],["Chun","Difficulty at the Beginning"],
        ["Mêng","Youthful Folly"],["Hsü","Waiting"],["Sung","Conflict"],
        ["Shih","The Army"],["Pi","Holding Together"],["Hsiao Ch'u","The Taming Power of the Small"],
        ["Lü","Treading"],["T'ai","Peace"],["P'i","Standstill"],
        ["T'ung Jên","Fellowship with Men"],["Ta Yu","Possession in Great Measure"],
        ["Ch'ien","Modesty"],["Yü","Enthusiasm"],["Sui","Following"],
        ["Ku","Work on What Has Been Spoiled"],["Lin","Approach"],["Kuan","Contemplation"],
        ["Shih Ho","Biting Through"],["Pi","Grace"],["Po","Splitting Apart"],
        ["Fu","Return"],["Wu Wang","Innocence"],["Ta Ch'u","The Taming Power of the Great"],
        ["I","Corners of the Mouth"],["Ta Kuo","Preponderance of the Great"],
        ["K'an","The Abysmal"],["Li","The Clinging"],
        ["Hsien","Influence"],["Hêng","Duration"],["Tun","Retreat"],
        ["Ta Chuang","The Power of the Great"],["Chin","Progress"],
        ["Ming I","Darkening of the Light"],["Chia Jên","The Family"],
        ["K'uei","Opposition"],["Chien","Obstruction"],["Hsieh","Deliverance"],
        ["Sun","Decrease"],["I","Increase"],["Kuai","Break-through"],
        ["Kou","Coming to Meet"],["Ts'ui","Gathering Together"],
        ["Shêng","Pushing Upward"],["K'un","Oppression"],["Ching","The Well"],
        ["Ko","Revolution"],["Ting","The Caldron"],
        ["Chên","The Arousing"],["Kên","Keeping Still"],
        ["Chien","Development"],["Kuei Mei","The Marrying Maiden"],
        ["Fêng","Abundance"],["Lü","The Wanderer"],
        ["Sun","The Gentle"],["Tui","The Joyous"],
        ["Huan","Dispersion"],["Chieh","Limitation"],
        ["Chung Fu","Inner Truth"],["Hsiao Kuo","Preponderance of the Small"],
        ["Chi Chi","After Completion"],["Wei Chi","Before Completion"],
      ],
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
      '110': { name: 'Лі',    attribute: 'Чіпке, Вогонь' },
      '101': { name: 'Туй',   attribute: 'Радісне, Озеро' },
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
        'Використайте /how_to для повної інструкції.',
      invalidInput:
        'Це не схоже на результат кидання монет.\n\n' +
        'Надішліть рівно 6 цифр, кожна 6–9 (нижня лінія першою).\n' +
        'Приклад: <code>789678</code>',
      theJudgment: 'СУДЖЕННЯ',
      theImage: 'ОБРАЗ',
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

    // ── Web reader ──
    web: {
      title: 'І Цзін',
      subtitle: 'Книга Змін',
      loading: 'Завантаження',
      contents: 'Зміст',
      previous: '← Попередній',
      next: 'Наступний →',
      errorLoad: 'Не вдалося завантажити розділ.',
      langToggleLabel: 'English',
      sections: {
        frontMatter: 'Вступні матеріали',
        bookI: 'Книга I — Текст',
        bookII: 'Книга II — Матеріал',
        bookIII: 'Книга III — Коментарі',
        appendixes: 'Додатки',
      },
      frontMatter: [
        { title: 'Передмова до третього видання', file: '00-preface-hellmut-wilhelm' },
        { title: 'Основні розділи матеріалу', file: '00-major-divisions' },
        { title: 'Передмова К.\u2009Ґ. Юнґа', file: '00-foreword-jung' },
        { title: 'Примітка перекладачки', file: '00-translators-note' },
        { title: 'Передмова Ріхарда Вільгельма', file: '00-preface-richard-wilhelm' },
        { title: 'Вступ', file: '00-introduction' },
      ],
      book2: [
        { title: 'Вступ до Книги II', file: 'book2-00-introduction' },
        { title: 'Шо Куа: Розмова про триграми', file: 'book2-01-shuo-kua' },
        { title: 'Та Чжуань: Великий Трактат', file: 'book2-02-ta-chuan' },
        { title: 'Структура гексаграм', file: 'book2-03-structure-of-hexagrams' },
      ],
      appendixes: [
        { title: 'Про консультування з оракулом', file: 'appendix-01-consulting-the-oracle' },
        { title: 'Гексаграми за будинками', file: 'appendix-02-hexagrams-by-houses' },
        { title: 'Примітки', file: 'appendix-03-notes' },
      ],
      hexNames: [
        ["Цянь","Творче"],["Кунь","Сприймальне"],["Чжунь","Труднощі на початку"],
        ["Мен","Юнацька необачність"],["Хсю","Очікування"],["Сун","Суперечка"],
        ["Ши","Військо"],["Пі","Тримання докупи"],["Сяо Чу","Приборкувальна сила малого"],
        ["Лю","Ступання"],["Тай","Мир"],["Пі","Застій"],
        ["Тун Жень","Єдність з людьми"],["Та Ю","Великий достаток"],
        ["Цянь","Скромність"],["Юй","Захоплення"],["Суй","Слідування"],
        ["Ку","Робота над зіпсованим"],["Лінь","Наближення"],["Куань","Споглядання"],
        ["Ши Хе","Прогризання"],["Бі","Краса"],["Бо","Розпад"],
        ["Фу","Повернення"],["У Ван","Невинність"],["Та Чу","Приборкувальна сила великого"],
        ["І","Кутки рота"],["Та Куо","Переважання великого"],
        ["Кань","Безодня"],["Лі","Чіпке"],
        ["Сянь","Вплив"],["Хен","Тривалість"],["Тунь","Відступ"],
        ["Да Чжуан","Сила великого"],["Цзінь","Поступ"],
        ["Мін І","Затемнення світла"],["Цзя Жень","Сімʼя"],
        ["Куй","Протилежність"],["Цзянь","Перешкода"],["Сє","Визволення"],
        ["Сунь","Зменшення"],["І","Збільшення"],["Куай","Прорив"],
        ["Коу","Вихід назустріч"],["Цуй","Збирання докупи"],
        ["Шен","Підйом"],["Кунь","Утиск"],["Цзін","Криниця"],
        ["Ко","Перетворення"],["Тінґ","Казан"],
        ["Чень","Збуджувальне"],["Кень","Непорушність"],
        ["Цзянь","Розвиток"],["Куей Мей","Молода наречена"],
        ["Фен","Достаток"],["Лю","Мандрівник"],
        ["Сунь","Лагідне"],["Туй","Радісне"],
        ["Хуань","Розпорошення"],["Цзє","Обмеження"],
        ["Чжун Фу","Внутрішня правда"],["Сяо Го","Переважання малого"],
        ["Цзі Цзі","Після завершення"],["Вей Цзі","Перед завершенням"],
      ],
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
