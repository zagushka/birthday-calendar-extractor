/**
 * Translate function returns string as a result
 * Use for string translations with replacements
 */
export function translateString(str: string, reps: Array<string> = []) {
  try {
    return chrome.i18n.getMessage(str, reps) || str;
  } catch (e) {
    return '';
  }
}
