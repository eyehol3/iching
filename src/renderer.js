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
  return isYang ? '  ━━━━━━━━━' : '  ━━━   ━━━';
}

/**
 * Render a hexagram with lines and trigram labels.
 *
 * @param {number[]} lines - 6 values bottom-to-top
 * @param {{ number, lower, upper }} hexInfo - from lookupHexagram
 * @returns {string} formatted text
 */
function renderHexagram(lines, hexInfo) {
  const parts = [];

  parts.push(`  above: ${hexInfo.upper.name} — ${hexInfo.upper.attribute}`);
  parts.push('');

  // Lines rendered top-to-bottom (line 6 at top, line 1 at bottom)
  const reversed = [...lines].reverse();
  for (const val of reversed) {
    parts.push(renderLine(val));
  }

  parts.push('');
  parts.push(`  below: ${hexInfo.lower.name} — ${hexInfo.lower.attribute}`);

  return parts.join('\n');
}

module.exports = { renderHexagram };
