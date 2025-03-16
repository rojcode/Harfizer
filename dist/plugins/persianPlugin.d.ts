/**
 * @fileoverview
 * The PersianLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times to their
 * Persian textual representation. It handles integer and decimal numbers,
 * negative values, date strings (Jalali or Gregorian), and time strings (HH:mm).
 */
import { ConversionOptions, InputNumber, Lexicon, LanguagePlugin } from "../core";
/**
 * PersianLanguagePlugin is responsible for converting Persian numbers,
 * dates, and times into their textual representations using predefined
 * lexicons and optional custom settings.
 */
export declare class PersianLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator string used to join parts of numbers (e.g. " و ").
     * In Persian, this is typically the word "و" (meaning "and").
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * The word used for zero in Persian.
     */
    private static readonly ZERO_WORD;
    /**
     * The word used for representing negative numbers in Persian.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * The default lexicon (word list) for Persian numbers.
     *
     * Structure explanation:
     * - [0]: single digits (0-9)
     * - [1]: numbers from 10 to 20
     * - [2]: tens (20, 30, 40, ...)
     * - [3]: hundreds (100, 200, ...)
     * - [4]: large scale units (thousand, million, billion, etc.)
     */
    private static readonly DEFAULT_LEXICON;
    /**
     * Default suffixes used for fractional parts in Persian (e.g. "دهم" for 0.1, "صدم" for 0.01, etc.).
     */
    private static readonly DEFAULT_DECIMAL_SUFFIXES;
    /**
     * Converts a three-digit number (or fewer digits) into its Persian textual form.
     * This function is intended to be used internally when processing larger numbers
     * in multiple three-digit chunks.
     *
     * @param {InputNumber} num - The three-digit number to convert.
     * @param {Lexicon} [lexicon] - Optional custom lexicon; defaults to PersianLanguagePlugin.DEFAULT_LEXICON.
     * @param {string} [_separator] - An optional parameter that is not used in this method.
     * @returns {string} The textual representation of the three-digit number (e.g. "یکصد و بیست و سه").
     */
    convertTripleToWords(num: InputNumber, lexicon?: Lexicon, _separator?: string): string;
    /**
     * A helper function for converting the fractional part of a decimal number to words.
     *
     * @param {string} fraction - The fractional part of the number (e.g. "456" in "123.456").
     * @param {string[]} [decimalSuffixes] - Custom suffixes for fractional parts;
     *                                       defaults to PersianLanguagePlugin.DEFAULT_DECIMAL_SUFFIXES.
     * @returns {string} A string representing the fractional part in Persian (e.g. " ممیز چهارصد و پنجاه و شش هزارم").
     */
    private convertFractionalPart;
    /**
     * Converts a given number (integer or decimal, possibly negative) into its Persian textual form.
     * This method also handles optional custom configurations, such as custom separator, lexicon,
     * decimal suffixes, and negative/zero words.
     *
     * @param {InputNumber} input - The number to be converted. It can be a string, a number, or a bigint.
     * @param {ConversionOptions} [options] - Optional configuration for customizing the conversion process.
     * @returns {string} The Persian word representation of the given number.
     * @throws {Error} If the input format is invalid or if the number exceeds the allowed range (more than 66 digits).
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * A static helper method to split a numeric string into groups of three digits.
     * Example: "1234567" => ["001","234","567"]
     *
     * @param {number | string} num - The number to be split into triples.
     * @returns {string[]} An array of three-digit strings.
     */
    private static splitIntoTriples;
    /**
     * Converts a date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format) into a textual representation in Persian.
     * It supports both Jalali (default) and Gregorian calendars.
     *
     * @param {string} dateStr - The date string to be converted (e.g. "1402/05/17" or "2023-04-05").
     * @param {"jalali" | "gregorian"} [calendar="jalali"] - Specifies whether the date is Jalali or Gregorian.
     * @returns {string} The Persian textual form of the given date (e.g. "هفدهم مرداد یک هزار و چهارصد و دو").
     * @throws {Error} If the format is invalid or if the month is out of range (not between 1 and 12).
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its Persian textual representation.
     * For instance, "09:05" => "ساعت نه و پنج دقیقه".
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The textual representation of the given time in Persian.
     * @throws {Error} If the format is invalid (not "HH:mm") or if hours/minutes are out of valid range.
     */
    convertTimeToWords(timeStr: string): string;
}
