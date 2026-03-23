const { getTrigram } = require('./trigrams');
const { locales } = require('./locales');

/**
 * Render a single line of the hexagram.
 * Yang (7,9) = solid:  ━━━━━━━━━
 * Yin  (6,8) = broken: ━━━   ━━━
 */
function renderLine(value) {
  const isYang = value === 7 || value === 9;
  return isYang ? '  ━━━━━━━━━' : '  ━━━   ━━━';
}

/**
 * Render a hexagram with lines and trigram labels.
 *
 * @param {number[]} lines - 6 values bottom-to-top
 * @param {{ number, lowerPattern, upperPattern }} hexInfo - from lookupHexagram
 * @param {string} lang - locale key
 * @returns {string} formatted text
 */
function renderHexagram(lines, hexInfo, lang = 'en') {
  const locale = locales[lang];
  const upper = getTrigram(hexInfo.upperPattern, lang);
  const lower = getTrigram(hexInfo.lowerPattern, lang);
  const parts = [];

  parts.push(`  ${locale.renderer.above}: ${upper.name} — ${upper.attribute}`);
  parts.push('');

  // Lines rendered top-to-bottom (line 6 at top, line 1 at bottom)
  const reversed = [...lines].reverse();
  for (const val of reversed) {
    parts.push(renderLine(val));
  }

  parts.push('');
  parts.push(`  ${locale.renderer.below}: ${lower.name} — ${lower.attribute}`);

  return parts.join('\n');
}

module.exports = { renderHexagram };
