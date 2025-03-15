/**
 * @fileoverview
 * The core module provides fundamental types, interfaces, and the CoreConverter class.
 * It delegates all number/date/time conversion processes to a given language plugin.
 */

/**
 * Represents an input number that can be of type number, string, or bigint.
 */
export type InputNumber = number | string | bigint;

/**
 * A type definition for a lexicon, represented as an array of string arrays.
 * For instance, each nested array might correspond to single digits, tens, hundreds, etc.
 */
export type Lexicon = string[][];

/**
 * Describes optional configurations used during the conversion process.
 *
 * @property {boolean} [useNegativeWord]        - Indicates whether to use a negative word (e.g. "منفی").
 * @property {string} [customSeparator]         - A custom separator string to join word segments (e.g. " و ").
 * @property {Lexicon} [customLexicon]          - A custom lexicon to override default word mappings.
 * @property {string[]} [customDecimalSuffixes] - Custom suffixes for fractional parts (e.g. "هزارم", "صدم").
 * @property {string} [customNegativeWord]      - A custom word/phrase to denote negative numbers.
 * @property {string} [customZeroWord]          - A custom word to represent zero.
 * @property {string} [customTimePrefix]        - A custom prefix for time strings (e.g. "ساعت" or "زمان").
 */
export interface ConversionOptions {
  useNegativeWord?: boolean;
  customSeparator?: string;
  customLexicon?: Lexicon;
  customDecimalSuffixes?: string[];
  customNegativeWord?: string;
  customZeroWord?: string;
  customTimePrefix?: string;
}

/**
 * The LanguagePlugin interface defines the required methods for any plugin
 * that provides language-specific conversions of numbers, dates, and times.
 * Each language implementation must adhere to these methods.
 */
export interface LanguagePlugin {
  /**
   * Converts a given number (InputNumber) into its word-based representation.
   *
   * @param {InputNumber} input  - The numeric value to be converted.
   * @param {ConversionOptions} [options] - Optional parameters to customize the conversion.
   * @returns {string} The textual representation in the target language.
   */
  convertNumber(input: InputNumber, options?: ConversionOptions): string;

  /**
   * Converts a three-digit number (or fewer digits) into words.
   * This is typically used internally when breaking larger numbers into three-digit groups.
   *
   * @param {InputNumber} num     - The numeric segment (up to 3 digits).
   * @param {Lexicon} [lexicon]   - A custom or default lexicon for translation.
   * @param {string} [separator]  - A custom separator if needed.
   * @returns {string} The word-based form of the three-digit segment.
   */
  convertTripleToWords(
    num: InputNumber,
    lexicon?: Lexicon,
    separator?: string
  ): string;

  /**
   * Converts a date string into its language-specific textual representation.
   * The date format is typically "YYYY/MM/DD" or "YYYY-MM-DD".
   *
   * @param {string} dateStr                       - The date string to be converted.
   * @param {"jalali" | "gregorian"} [calendar]    - Specifies which calendar system to use.
   * @returns {string} The textual representation of the date in the target language.
   */
  convertDateToWords(
    dateStr: string,
    calendar?: "jalali" | "gregorian"
  ): string;

  /**
   * Converts a time string in "HH:mm" format to words in the target language.
   *
   * @param {string} timeStr - The time string to be converted.
   * @returns {string} A textual representation of the given time.
   */
  convertTimeToWords(timeStr: string): string;
}

/**
 * CoreConverter acts as a bridge between the calling code and a specified LanguagePlugin.
 * It delegates all conversion tasks (number, date, time) to the given plugin.
 */
export class CoreConverter {
  /**
   * The language plugin that will perform the actual conversions.
   */
  private plugin: LanguagePlugin;

  /**
   * @constructor
   * @param {LanguagePlugin} plugin - An instance of a language plugin implementing all required methods.
   */
  constructor(plugin: LanguagePlugin) {
    this.plugin = plugin;
  }

  /**
   * Converts a number into words by delegating to the plugin's convertNumber method.
   *
   * @param {InputNumber} input             - The number to be converted.
   * @param {ConversionOptions} [options]   - Optional configuration for the conversion process.
   * @returns {string} The word-based representation of the number.
   */
  public convertNumber(
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    return this.plugin.convertNumber(input, options);
  }

  /**
   * Converts a triple-digit group into words using the plugin's convertTripleToWords method.
   *
   * @param {InputNumber} num              - The three-digit (or fewer) numeric value to convert.
   * @param {Lexicon} [lexicon]           - A custom or default lexicon.
   * @param {string} [separator]          - A custom separator (ignored if the plugin doesn't need it).
   * @returns {string} The textual form of the three-digit group.
   */
  public convertTripleToWords(
    num: InputNumber,
    lexicon?: Lexicon,
    separator?: string
  ): string {
    return this.plugin.convertTripleToWords(num, lexicon, separator);
  }

  /**
   * Converts a date string to words using the plugin's convertDateToWords method.
   *
   * @param {string} dateStr                     - The date string ("YYYY/MM/DD" or "YYYY-MM-DD").
   * @param {"jalali" | "gregorian"} [calendar]  - The calendar system to use (default is "jalali").
   * @returns {string} The textual representation of the date in the plugin's language.
   */
  public convertDateToWords(
    dateStr: string,
    calendar?: "jalali" | "gregorian"
  ): string {
    return this.plugin.convertDateToWords(dateStr, calendar);
  }

  /**
   * Converts a time string ("HH:mm") to words using the plugin's convertTimeToWords method.
   *
   * @param {string} timeStr - The time string in "HH:mm" format.
   * @returns {string} The textual form of the time.
   */
  public convertTimeToWords(timeStr: string): string {
    return this.plugin.convertTimeToWords(timeStr);
  }

  /**
   * A static helper method for quick number-to-words conversion without manually
   * instantiating a CoreConverter. The caller provides the plugin instance.
   *
   * @param {LanguagePlugin} plugin          - The language plugin to perform the conversion.
   * @param {InputNumber} input             - The number to be converted.
   * @param {ConversionOptions} [options]   - Optional configuration for the conversion.
   * @returns {string} The word-based representation of the given number.
   */
  public static toWords(
    plugin: LanguagePlugin,
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    return plugin.convertNumber(input, options);
  }
}
