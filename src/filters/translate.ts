import parse from 'html-react-parser';

/**
 * Translate function
 */
export default function translate(...args: [string, ...any]) {
  return parse(chrome.i18n.getMessage(...args) || args[0]);
}
