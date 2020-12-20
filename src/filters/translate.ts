import HTMLReactParser from 'html-react-parser';

/**
 * Translate function returns RSX element/s
 * Use in rsx templates
 */
export function translate(...args: [string, ...any]) {
  return HTMLReactParser(translateString(...args));
}

/**
 * Translate function returns string as a result
 * Use for string translations with replacements
 */
export function translateString(...args: [string, ...any]) {
  return chrome.i18n.getMessage(...args) || args[0];
}
