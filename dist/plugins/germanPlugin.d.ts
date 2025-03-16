/**
 * @fileoverview
 * The GermanLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * German textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: The Persian solar calendar is specific to Persian; for German,
 * the Gregorian calendar is used and dates are formatted in a natural German style.
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class GermanLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator for joining tokens.
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * The word for zero in German.
     */
    private static readonly ZERO_WORD;
    /**
     * The word for negative numbers in German.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Scale units in German for grouping numbers.
     */
    private static readonly SCALE;
    private static readonly UNITS;
    private static readonly TEENS;
    private static readonly TENS;
    /**
     * Converts a number less than 1000 into its German textual representation.
     * For numbers 100 and above, the hundreds and the remainder are concatenated
     * into one compound word without a space.
     *
     * Examples:
     *   7    => "sieben"
     *   15   => "fünfzehn"
     *   23   => "dreiundzwanzig"
     *   300  => "dreihundert"
     *   456  => "vierhundertsechsundfünfzig"
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
     * Converts a three-digit number (or fewer) into its German textual form.
     * This function is used internally to process larger numbers.
     *
     * @param {InputNumber} num - The three-digit number to convert.
     * @param {any} [lexicon] - Not used in German conversion.
     * @param {string} [_separator] - Not used in this method.
     * @returns {string} The textual representation (e.g. "vierhundertsechsundfünfzig").
     */
    convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string;
    /**
     * Converts a given number (integer or decimal, possibly negative) into its German textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "Komma".
     *
     * @param {InputNumber} input - The number to be converted. It can be a string, a number, or a bigint.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The German textual representation of the number.
     * @throws {Error} If the input format is invalid or if the number exceeds the allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its English textual representation.
     * The output format is "Month Day, Year", e.g. "April 5, two thousand twenty-three".
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
