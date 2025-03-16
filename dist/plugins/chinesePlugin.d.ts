/**
 * @fileoverview
 * The ChineseLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Chinese textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: Since the Persian solar calendar is specific to Persian, for Chinese,
 * the Gregorian calendar is used and dates are formatted as "YYYY年MM月DD日".
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class ChineseLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator used to join tokens.
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * Chinese word for zero.
     */
    private static readonly ZERO_WORD;
    /**
     * Word for negative numbers.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Large scale units in Chinese for grouping by 4 digits.
     * For example: 10^0, 10^4, 10^8, 10^12, ...
     */
    private static readonly SCALE;
    /**
     * Converts a number less than 10,000 into its Chinese textual representation.
     *
     * @param {number} n - Number less than 10,000.
     * @returns {string} The Chinese numeral representation.
     *
     * Examples:
     *   7    => "七"
     *   15   => "十五"
     *   42   => "四十二"
     *   300  => "三百"
     *   456  => "四百五十六"
     */
    private convertBelowTenThousand;
    /**
     * Converts a group of up to 4 digits (as InputNumber) into its Chinese textual representation.
     * This method is required by the LanguagePlugin interface.
     *
     * @param {InputNumber} num - The number (up to 4 digits) to convert.
     * @param {any} [lexicon] - Ignored in Chinese conversion.
     * @param {string} [_separator] - Ignored in Chinese conversion.
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
     * Converts a given number (integer or decimal, possibly negative) into its Chinese textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "点".
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The Chinese textual representation of the number.
     * @throws {Error} If the input format is invalid or if the number exceeds allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its Chinese textual representation.
     * The output format is "YYYY年MM月DD日", where each part is converted using convertNumber.
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for Chinese.
     * @returns {string} The Chinese textual form of the date.
     * @throws {Error} If the format is invalid or if the month is out of range.
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its Chinese textual representation.
     * The output format is "<hour>时<minute>分". If minute is zero, only "<hour>时" is returned.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The Chinese textual representation of the time.
     * @throws {Error} If the format is invalid or if hours/minutes are out of range.
     */
    convertTimeToWords(timeStr: string): string;
}
