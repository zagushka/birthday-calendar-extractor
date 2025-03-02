import HTMLReactParser from "html-react-parser";
import { translateString } from "@/filters/translateString";

/**
 * Translate function returns RSX element/s
 * Use in rsx templates
 */
export function t(str: string, reps: Array<string> = []) {
  return HTMLReactParser(translateString(str, reps));
}
