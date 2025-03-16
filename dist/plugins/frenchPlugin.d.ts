/**
 * @fileoverview
 * The FrenchLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * French textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: The Persian solar calendar is specific to Persian. For French, the
 * Gregorian calendar is used with French month names.
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class FrenchLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator for joining parts (space in French).
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * Word for zero in French.
     */
    private static readonly ZERO_WORD;
    /**
     * Word used for negative numbers.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Large scale units in French for thousand grouping.
     * Extended to support up to 22 levels (e.g. décilliard).
     * Note: "mille" is used without "un" for 1000.
     */
    private static readonly SCALE;
    /**
     * **اضافه شده برای رفع خطای اینترفیس**
     * Converts a three-digit number (or fewer) into its French textual representation.
     * This method is required by the LanguagePlugin interface.
     *
     * @param {InputNumber} num - The three-digit number to convert.
     * @param {any} [lexicon] - This parameter is ignored in French conversion.
     * @param {string} [_separator] - This parameter is ignored in French conversion.
     * @returns {string} The textual representation of the three-digit number.
     */
    convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string;
    /**
     * Converts a number below 100 into its French textual representation.
     * Handles special cases such as 21, 31, etc. and the peculiarities of 70-79 and 80-99.
     *
     * @param {number} n - Number less than 100.
     * @returns {string} The French words for the given number.
     */
    private convertBelowHundred;
    /**
     * Converts a number below 1000 into its French textual representation.
     * Handles the hundreds and the special plural rule for "cent".
     *
     * @param {number} n - Number less than 1000.
     * @returns {string} The French words for the given number.
     */
    private convertBelowThousand;
    /**
     * Splits a numeric string into groups of three digits.
     * Example: "1234567" => ["1", "234", "567"]
     *
     * @param {string | number} num - The number to be split.
     * @returns {string[]} An array of three-digit groups.
     */
    private static splitIntoTriples;
    /**
     * Converts a given number (integer or decimal, possibly negative) into its French textual form.
     * Handles custom options and converts the fractional part by reading each digit.
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Optional configuration.
     *        Supported options:
     *          - customZeroWord: override the default word for zero.
     *          - customNegativeWord: override the default negative word.
     *          - customSeparator: override the default separator between number groups.
     * @returns {string} The French word representation of the given number.
     * @throws {Error} If the input format is invalid or if the number is out of allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its French textual representation.
     * For day 1, "premier" is used; month names are in French.
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for French.
     * @returns {string} The French textual form of the given date.
     * @throws {Error} If the format is invalid or month is out of range.
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its French textual representation.
     * Example: "09:05" => "Il est neuf heures cinq minutes".
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The French textual representation of the time.
     * @throws {Error} If the format is invalid or hours/minutes are out of range.
     */
    convertTimeToWords(timeStr: string): string;
}
