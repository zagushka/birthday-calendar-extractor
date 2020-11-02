/**
 * Translate pipe filter
 */
export default function translatePipe(...args: [string, ...any]) {
  return chrome.i18n.getMessage(...args);
}
