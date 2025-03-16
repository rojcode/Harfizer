/**
 * @fileoverview
 * The JapaneseLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Japanese textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: Since the Persian solar calendar is specific to Persian, for Japanese,
 * the Gregorian calendar is used and dates are formatted as "YYYY年MM月DD日".
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class JapaneseLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator for joining parts.
     * In Japanese, numbers are usually read continuously,
     * but for clarity we use a space.
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * Word for zero in Japanese (using Kanji).
     */
    private static readonly ZERO_WORD;
    /**
     * Word used for negative numbers.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Large scale units in Japanese for grouping numbers by 4 digits.
     * These represent 10^4, 10^8, 10^12, etc.
     */
    private static readonly SCALE;
    /**
     * Converts a number with up to 4 digits into its Japanese textual representation.
     * This function handles numbers less than 10,000.
     *
     * @param {number} n - Number less than 10,000.
     * @returns {string} The Japanese representation (using Kanji).
     *
     * Examples:
     *   7   => "七"
     *   15  => "十五"
     *   42  => "四十二"
     *   300 => "三百"
     *   456 => "四百五十六"
     */
    private convertBelowTenThousand;
    /**
     * **Implemented to satisfy LanguagePlugin interface**
     * Converts a group of up to 4 digits (treated as a "triple" per interface)
     * into its Japanese textual representation.
     *
     * @param {InputNumber} num - The number (up to 4 digits) to convert.
     * @param {any} [lexicon] - Ignored.
     * @param {string} [_separator] - Ignored.
     * @returns {string} The textual representation.
     */
    convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string;
    /**
     * Splits a numeric string into groups of 4 digits (from right to left).
     *
     * Example: "12345678" => ["1234", "5678"]
     *
     * @param {string | number} num - The number to be split.
     * @returns {string[]} An array of 4-digit groups.
     */
    private static splitIntoQuadruples;
    /**
     * Converts a given number (integer or decimal, possibly negative) into its Japanese textual form.
     * Handles custom options and converts the fractional part digit-by-digit (using "点" for decimal).
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The Japanese textual representation of the number.
     * @throws {Error} If the input format is invalid or out of allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its Japanese textual representation.
     * The output format is "YYYY年MM月DD日", where the year, month, and day are
     * converted using convertNumber.
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for Japanese.
     * @returns {string} The Japanese textual form of the date.
     * @throws {Error} If the format is invalid or month is out of range.
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its Japanese textual representation.
     * The output format is "<hour>時<minute>分". If minutes are zero, only "<hour>時" is returned.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The Japanese textual representation of the time.
     * @throws {Error} If the format is invalid or hours/minutes are out of range.
     */
    convertTimeToWords(timeStr: string): string;
}
