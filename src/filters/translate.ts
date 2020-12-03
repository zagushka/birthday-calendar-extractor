/**
 * Translate function
 */
export default function translate(...args: [string, ...any]) {
  return chrome.i18n.getMessage(...args) || args[0];
}
