const { KING_WEN } = require('./trigrams');

/**
 * Validate coin-toss input: exactly 6 digits, each 6–9.
 * @param {string} input
 * @returns {{ valid: boolean, error?: string }}
 */
function validateInput(input) {
  if (typeof input !== 'string') return { valid: false, error: 'Input must be a string.' };
  const trimmed = input.trim();
  if (trimmed.length !== 6) {
    return { valid: false, error: 'Please send exactly 6 digits (one per line, bottom to top).' };
  }
  for (const ch of trimmed) {
    if (!'6789'.includes(ch)) {
      return { valid: false, error: 'Each digit must be 6, 7, 8, or 9.' };
    }
  }
  return { valid: true };
}

/**
 * Convert a line value (6–9) to yin/yang.
 * 7, 9 → yang (solid, 1)
 * 6, 8 → yin  (broken, 0)
 */
function lineToYinYang(value) {
  return (value === 7 || value === 9) ? '1' : '0';
}

/**
 * Get the binary pattern for a trigram from 3 line values.
 * @param {number[]} lines - 3 values, each 6–9
 * @returns {string} binary pattern e.g. '111'
 */
function trigramPattern(lines) {
  return lines.map(lineToYinYang).join('');
}

/**
 * Look up a hexagram from 6 line values.
 * Returns pattern strings for trigrams (display names resolved per-locale at render time).
 * @param {number[]} lines - 6 values (bottom to top), each 6–9
 * @returns {{ number: number, lowerPattern: string, upperPattern: string }}
 */
function lookupHexagram(lines) {
  const lowerPattern = trigramPattern(lines.slice(0, 3));
  const upperPattern = trigramPattern(lines.slice(3, 6));
  const number = KING_WEN[upperPattern][lowerPattern];
  return { number, lowerPattern, upperPattern };
}

/**
 * Detect which lines are changing (value 6 or 9).
 * @param {number[]} lines - 6 values
 * @returns {number[]} indices (0-based, bottom to top) of moving lines
 */
function getChangingLines(lines) {
  const moving = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 6 || lines[i] === 9) {
      moving.push(i);
    }
  }
  return moving;
}

/**
 * Flip moving lines to derive the second hexagram.
 * 6 → 7 (yin → yang), 9 → 8 (yang → yin)
 * @param {number[]} lines - original 6 values
 * @returns {number[]} flipped values
 */
function flipLines(lines) {
  return lines.map(v => {
    if (v === 6) return 7;
    if (v === 9) return 8;
    return v;
  });
}

/**
 * Full reading from a 6-digit input string.
 * @param {string} input - e.g. "789678"
 * @returns {{ primary, secondary?, changingLines, lines }}
 */
function getReading(input) {
  const lines = input.split('').map(Number);
  const primary = lookupHexagram(lines);
  const changingLines = getChangingLines(lines);

  const result = { primary, changingLines, lines };

  if (changingLines.length > 0) {
    const flipped = flipLines(lines);
    result.secondary = lookupHexagram(flipped);
    result.flippedLines = flipped;
  }

  return result;
}

module.exports = { validateInput, getReading, lookupHexagram, getChangingLines, flipLines };
