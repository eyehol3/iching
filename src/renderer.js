const { getTitle } = require('./content');

/**
 * Render a single line of the hexagram.
 * Yang (7,9) = solid:  ━━━━━━━━━
 * Yin  (6,8) = broken: ━━━   ━━━
 *
 * @param {number} value - line value (6–9)
 * @returns {string}
 */
function renderLine(value) {
  const isYang = value === 7 || value === 9;
  const line = isYang ? '━━━━━━━━━' : '━━━   ━━━';

  let annotation = `(${value})`;
  if (value === 9) annotation += ' ◯';
  else if (value === 6) annotation += ' ✕';

  return `  ${line}  ${annotation}`;
}

/**
 * Render a full hexagram with lines, trigram labels, and title.
 *
 * @param {number[]} lines - 6 values bottom-to-top
 * @param {{ number, lower, upper }} hexInfo - from lookupHexagram
 * @returns {string} formatted text
 */
function renderHexagram(lines, hexInfo) {
  const title = getTitle(hexInfo.number);
  const parts = [];

  // Title
  if (title) parts.push(title);
  parts.push('');

  // Upper trigram label
  parts.push(`  above: ${hexInfo.upper.name} — ${hexInfo.upper.attribute}`);
  parts.push('');

  // Lines rendered top-to-bottom (line 6 at top, line 1 at bottom)
  const reversed = [...lines].reverse();
  for (const val of reversed) {
    parts.push(renderLine(val));
  }

  parts.push('');
  // Lower trigram label
  parts.push(`  below: ${hexInfo.lower.name} — ${hexInfo.lower.attribute}`);

  return parts.join('\n');
}

/**
 * Render a complete reading (primary + optional second hexagram).
 *
 * @param {object} reading - from getReading()
 * @returns {string}
 */
function renderReading(reading) {
  const parts = [];

  parts.push(renderHexagram(reading.lines, reading.primary));

  if (reading.secondary) {
    parts.push('');
    parts.push('         ⤷ transforms into:');
    parts.push('');
    parts.push(renderHexagram(reading.flippedLines, reading.secondary));
  }

  return parts.join('\n');
}

module.exports = { renderHexagram, renderReading };
