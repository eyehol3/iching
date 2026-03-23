const { locales } = require('./locales');

/**
 * The 8 trigrams — binary pattern (bottom to top).
 * Binary: 1 = yang (solid), 0 = yin (broken)
 * Display names come from locales.
 */
const TRIGRAM_PATTERNS = ['111', '100', '010', '001', '000', '011', '110', '101'];

/**
 * Get a trigram object for the given pattern and language.
 * @param {string} pattern - binary pattern e.g. '111'
 * @param {string} lang - 'en' or 'ua'
 * @returns {{ name: string, attribute: string, pattern: string }}
 */
function getTrigram(pattern, lang = 'en') {
  const t = locales[lang].trigrams[pattern];
  if (!t) return null;
  return { ...t, pattern };
}

/**
 * King Wen sequence lookup table.
 * KING_WEN[upper_pattern][lower_pattern] = hexagram number (1–64)
 */
const KING_WEN = {
  '111': { '111':1,  '100':25, '010':6,  '001':33, '000':12, '011':44, '110':13, '101':10 },
  '100': { '111':34, '100':51, '010':40, '001':62, '000':16, '011':32, '110':55, '101':54 },
  '010': { '111':5,  '100':3,  '010':29, '001':39, '000':8,  '011':48, '110':63, '101':60 },
  '001': { '111':26, '100':27, '010':4,  '001':52, '000':23, '011':18, '110':22, '101':41 },
  '000': { '111':11, '100':24, '010':7,  '001':15, '000':2,  '011':46, '110':36, '101':19 },
  '011': { '111':9,  '100':42, '010':59, '001':53, '000':20, '011':57, '110':37, '101':61 },
  '110': { '111':14, '100':21, '010':64, '001':56, '000':35, '011':50, '110':30, '101':38 },
  '101': { '111':43, '100':17, '010':47, '001':31, '000':45, '011':28, '110':49, '101':58 },
};

module.exports = { getTrigram, KING_WEN };
