const fs = require('fs');
const path = require('path');
const { locales, buildLinePattern, SUPPORTED_LANGS } = require('./locales');

const ICHING_DIR = path.join(__dirname, '..', 'iching');

// content[lang].hexFiles[number] = { filename, content }
// content[lang].comFiles[number] = { filename, content }
// content[lang].hexTitles[number] = title string
const content = {};

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
function extractTitle(fileContent) {
  const first = fileContent.split('\n')[0];
  return first.replace(/^#\s*/, '').trim();
}

/**
 * Extract the intro text: everything between the title/images and the judgment header.
 */
function extractIntro(fileContent, lang) {
  const locale = locales[lang];
  const lines = fileContent.split('\n');
  let startIdx = 0;

  // Skip the title line, image lines, and blank lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || line.startsWith('![') || line === '') {
      startIdx = i + 1;
    } else {
      break;
    }
  }

  // Find the judgment header
  const headerPattern = new RegExp(`^###\\s+${locale.sectionHeaders.judgment}`, 'i');
  let endIdx = lines.length;
  for (let i = startIdx; i < lines.length; i++) {
    if (headerPattern.test(lines[i])) {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx, endIdx).join('\n').trim();
}

/**
 * Extract a section's oracle text (the blockquoted lines).
 * @param {string} fileContent - full markdown content
 * @param {string} sectionName - e.g. "THE JUDGMENT" or "СУДЖЕННЯ"
 * @returns {string|null}
 */
function extractSection(fileContent, sectionName) {
  const lines = fileContent.split('\n');
  const headerPattern = new RegExp(`^###\\s+${sectionName}`, 'i');

  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headerPattern.test(lines[i])) {
      startIdx = i + 1;
      break;
    }
  }
  if (startIdx === -1) return null;

  const quoteLines = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    if (line.startsWith('>')) {
      quoteLines.push(line);
    } else {
      break;
    }
  }

  return quoteLines.length > 0 ? quoteLines.join('\n') : null;
}

/**
 * Extract specific moving line text by position.
 * @param {string} fileContent - full markdown content
 * @param {number} position - 1-based line position (1=bottom, 6=top)
 * @param {number} lineValue - 6 or 9
 * @param {string} lang - locale key
 * @returns {string|null}
 */
function extractLineText(fileContent, position, lineValue, lang) {
  const locale = locales[lang];
  const headerPattern = buildLinePattern(locale, position, lineValue);
  const lines = fileContent.split('\n');
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (headerPattern.test(lines[i])) {
      startIdx = i;
      break;
    }
  }

  if (startIdx === -1) return null;

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
 * Load all hex-*.md and com-*.md files for all supported languages.
 */
function loadContent() {
  for (const lang of SUPPORTED_LANGS) {
    const langDir = path.join(ICHING_DIR, lang);
    content[lang] = { hexFiles: {}, comFiles: {}, hexTitles: {} };

    if (!fs.existsSync(langDir)) {
      console.warn(`Warning: content directory not found for language "${lang}" at ${langDir}`);
      continue;
    }

    const files = fs.readdirSync(langDir);
    for (const filename of files) {
      const num = extractNumber(filename);
      if (num === null) continue;

      const fileContent = fs.readFileSync(path.join(langDir, filename), 'utf-8');

      if (filename.startsWith('hex-')) {
        content[lang].hexFiles[num] = { filename: filename.replace('.md', ''), content: fileContent };
        content[lang].hexTitles[num] = extractTitle(fileContent);
      } else if (filename.startsWith('com-')) {
        content[lang].comFiles[num] = { filename: filename.replace('.md', ''), content: fileContent };
      }
    }

    console.log(`[${lang}] Loaded ${Object.keys(content[lang].hexFiles).length} hexagram texts and ${Object.keys(content[lang].comFiles).length} commentaries.`);
  }
}

function getIntro(hexNumber, lang = 'en') {
  const hex = content[lang]?.hexFiles[hexNumber];
  if (!hex) return null;
  return extractIntro(hex.content, lang);
}

function getTitle(hexNumber, lang = 'en') {
  return content[lang]?.hexTitles[hexNumber] || null;
}

function getHexFilename(hexNumber, lang = 'en') {
  return content[lang]?.hexFiles[hexNumber]?.filename || null;
}

function getComFilename(hexNumber, lang = 'en') {
  return content[lang]?.comFiles[hexNumber]?.filename || null;
}

function getMovingLineTexts(hexNumber, positions, lineValues, lang = 'en') {
  const hex = content[lang]?.hexFiles[hexNumber];
  if (!hex) return [];

  const texts = [];
  for (const pos of positions) {
    const text = extractLineText(hex.content, pos + 1, lineValues[pos], lang);
    if (text) texts.push(text);
  }
  return texts;
}

function getJudgment(hexNumber, lang = 'en') {
  const hex = content[lang]?.hexFiles[hexNumber];
  if (!hex) return null;
  return extractSection(hex.content, locales[lang].sectionHeaders.judgment);
}

function getImage(hexNumber, lang = 'en') {
  const hex = content[lang]?.hexFiles[hexNumber];
  if (!hex) return null;
  return extractSection(hex.content, locales[lang].sectionHeaders.image);
}

module.exports = { loadContent, getIntro, getTitle, getHexFilename, getComFilename, getMovingLineTexts, getJudgment, getImage };
