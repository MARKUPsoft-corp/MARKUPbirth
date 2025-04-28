/**
 * Utils for the birthday website server
 */

const crypto = require('crypto');

/**
 * Generate a random ID of specified length
 * @param {number} length - Length of ID to generate
 * @returns {string} - Random ID
 */
function makeId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Validate file type based on mimetype
 * @param {string} mimetype MIME type of the file
 * @param {string} type Expected file type ('photos' or 'videos')
 * @returns {boolean} Whether the file type is valid
 */
function validateFileType(mimetype, type) {
  if (type === 'photos') {
    return mimetype.startsWith('image/');
  } else if (type === 'videos') {
    return mimetype.startsWith('video/');
  }
  return false;
}

/**
 * Get file extension from mimetype
 * @param {string} mimetype MIME type of the file
 * @returns {string} File extension with dot
 */
function getExtensionFromMimetype(mimetype) {
  const mimetypeToExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogv'
  };
  
  return mimetypeToExt[mimetype] || '';
}

/**
 * Filter for SQL-like injection in text inputs
 * @param {string} text - Input text
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  if (!text) return '';
  
  // Remove potentially harmful characters
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

module.exports = {
  makeId,
  validateFileType,
  getExtensionFromMimetype,
  sanitizeText
}; 