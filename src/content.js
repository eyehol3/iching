const fs = require('fs');
const path = require('path');

const ICHING_DIR = path.join(__dirname, '..', 'iching');

let hexFiles = {};   // number → { filename, content }
let comFiles = {};   // number → { filename, content }
let hexTitles = {};  // number → title string (e.g. "63. Chi Chi / After Completion")

/**
 * Extract hexagram number from filename.
 * e.g. "hex-63-chi-chi-after-completion.md" → 63
 */
function extractNumber(filename) {
  const match = filename.match(/^(?:hex|com)-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract the title from the first line of a hex file.
 * e.g. "# 63. Chi Chi / After Completion" → "63. Chi Chi / After Completion"
 */
function extractTitle(content) {
  const first = content.split('\n')[0];
  return first.replace(/^#\s*/, '').trim();
}

/**
 * Extract the intro text: everything between the title/images and "### THE JUDGMENT".
 * This is the opening description paragraph(s).
 */
function extractIntro(content) {
  // Find the start: skip the title line and any image lines
  const lines = content.split('\n');
  let startIdx = 0;

  // Skip the title line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || line.startsWith('![') || line === '') {
      startIdx = i + 1;
    } else {
      break;
    }
  }

  // Find "### THE JUDGMENT"
  let endIdx = lines.length;
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].trim().match(/^###\s+THE JUDGMENT/i)) {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx, endIdx).join('\n').trim();
}

/**
 * Extract specific moving line text by position (1-based, bottom to top).
 * Looks for headers like:
 *   "#### Nine at the beginning means:"
 *   "#### Six in the second place means:"
 *   "#### Nine in the third place means:"
 *   etc.
 *
 * @param {string} content - full markdown content
 * @param {number} position - 1-based line position (1=bottom, 6=top)
 * @param {number} lineValue - 6 or 9
 * @returns {string|null} the line text, or null if not found
 */
function extractLineText(content, position, lineValue) {
  const positionWords = ['beginning', 'second place', 'third place', 'fourth place', 'fifth place', 'top'];
  const valueWord = lineValue === 9 ? 'Nine' : 'Six';
  const posWord = positionWords[position - 1];

  // Build pattern to match the header
  // "#### Nine at the beginning means:" or "#### Six in the second place means:"
  const preposition = position === 1 ? 'at the' : position === 6 ? 'at the' : 'in the';
  const headerPattern = new RegExp(
    `^####\\s+${valueWord}\\s+${preposition}\\s+${posWord}`,
    'im'
  );

  const lines = content.split('\n');
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (headerPattern.test(lines[i])) {
      startIdx = i;
      break;
    }
  }

  if (startIdx === -1) return null;

  // Collect text until the next #### header or --- or end of file
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('####') || line === '---') {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx, endIdx).join('\n').trim();
}

/**
 * Load all hex-*.md and com-*.md files into memory.
 * Call once at startup.
 */
function loadContent() {
  const files = fs.readdirSync(ICHING_DIR);

  for (const filename of files) {
    const num = extractNumber(filename);
    if (num === null) continue;

    const content = fs.readFileSync(path.join(ICHING_DIR, filename), 'utf-8');

    if (filename.startsWith('hex-')) {
      hexFiles[num] = { filename: filename.replace('.md', ''), content };
      hexTitles[num] = extractTitle(content);
    } else if (filename.startsWith('com-')) {
      comFiles[num] = { filename: filename.replace('.md', ''), content };
    }
  }

  console.log(`Loaded ${Object.keys(hexFiles).length} hexagram texts and ${Object.keys(comFiles).length} commentaries.`);
}

/**
 * Get the intro text for a hexagram number.
 */
function getIntro(hexNumber) {
  const hex = hexFiles[hexNumber];
  if (!hex) return null;
  return extractIntro(hex.content);
}

/**
 * Get the title for a hexagram number.
 */
function getTitle(hexNumber) {
  return hexTitles[hexNumber] || null;
}

/**
 * Get the hex filename (without .md) for URL linking.
 */
function getHexFilename(hexNumber) {
  return hexFiles[hexNumber]?.filename || null;
}

/**
 * Get the com filename (without .md) for URL linking.
 */
function getComFilename(hexNumber) {
  return comFiles[hexNumber]?.filename || null;
}

/**
 * Get moving line texts for given positions.
 * @param {number} hexNumber
 * @param {number[]} positions - 0-based indices of moving lines
 * @param {number[]} lineValues - original line values (6–9)
 * @returns {string[]} array of line texts
 */
function getMovingLineTexts(hexNumber, positions, lineValues) {
  const hex = hexFiles[hexNumber];
  if (!hex) return [];

  const texts = [];
  for (const pos of positions) {
    const text = extractLineText(hex.content, pos + 1, lineValues[pos]);
    if (text) texts.push(text);
  }
  return texts;
}

module.exports = { loadContent, getIntro, getTitle, getHexFilename, getComFilename, getMovingLineTexts };
