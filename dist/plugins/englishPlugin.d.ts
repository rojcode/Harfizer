/**
 * @fileoverview
 * The EnglishLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * English textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: The Persian solar calendar is specific to Persian; for English,
 * the Gregorian calendar is used and dates are formatted as "Month Day, Year".
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class EnglishLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator for joining parts.
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * The word used for zero in English.
     */
    private static readonly ZERO_WORD;
    /**
     * The word used for representing negative numbers in English.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Scale units in English for grouping numbers by thousands.
     */
    private static readonly SCALE;
    private static readonly UNITS;
    private static readonly TEENS;
    private static readonly TENS;
    /**
     * Converts a number less than 1000 into its English textual representation.
     *
     * @param {number} n - Number less than 1000.
     * @returns {string} The English representation.
     *
     * Examples:
     *   7   => "seven"
     *   15  => "fifteen"
     *   42  => "forty-two"
     *   300 => "three hundred"
     *   456 => "four hundred fifty-six"
     */
    private convertBelowThousand;
    /**
     * Splits a numeric string into groups of three digits (from right to left).
     *
     * Example: "1234567" => ["1", "234", "567"]
     *
     * @param {string | number} num - The number to be split.
     * @returns {string[]} An array of three-digit groups.
     */
    private static splitIntoTriples;
    /**
     * Converts a three-digit number (or fewer) into its English textual form.
     * This function is used internally to process larger numbers.
     *
     * @param {InputNumber} num - The three-digit number to convert.
     * @param {any} [lexicon] - Not used in English conversion.
     * @param {string} [_separator] - Not used in this method.
     * @returns {string} The textual representation (e.g. "four hundred fifty-six").
     */
    convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string;
    /**
     * Converts a given number (integer or decimal, possibly negative) into its English textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "point".
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The English textual representation of the number.
     * @throws {Error} If the input format is invalid or out of allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its English textual representation.
     * The output format is "Month Day, Year", e.g. "April 5, 2023".
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for English.
     * @returns {string} The English textual form of the date.
     * @throws {Error} If the format is invalid or if the month is out of range.
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its English textual representation.
     * The output format is "It is <hour> o'clock and <minute> minutes".
     * If minutes are zero, returns "It is <hour> o'clock".
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The English textual representation of the time.
     * @throws {Error} If the format is invalid or if hours/minutes are out of range.
     */
    convertTimeToWords(timeStr: string): string;
}
