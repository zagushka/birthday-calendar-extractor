/**
 * Translate pipe filter
 */
export default function translateFilter(...args: [string, ...any]) {
  return chrome.i18n.getMessage(...args) || args[0];
}
