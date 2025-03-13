/**
 * Type alias for input numbers. The input can be a number, string, or bigint.
 */
export type InputNumber = number | string | bigint;
/**
 * Type alias for a lexicon, which is represented as an array of string arrays.
 */
export type Lexicon = string[][];
/**
 * Options for customizing the conversion process.
 *
 * @property {boolean} [useNegativeWord] - Flag to indicate whether to use a negative word.
 * @property {string} [customSeparator] - Custom separator string to join groups in the final output.
 * @property {Lexicon} [customLexicon] - Custom lexicon used for number-to-word conversion.
 * @property {string[]} [customDecimalSuffixes] - Custom array of suffixes for the fractional part.
 * @property {string} [customNegativeWord] - Custom word to denote negative numbers.
 * @property {string} [customZeroWord] - Custom word to represent zero.
 */
export interface ConversionOptions {
    useNegativeWord?: boolean;
    customSeparator?: string;
    customLexicon?: Lexicon;
    customDecimalSuffixes?: string[];
    customNegativeWord?: string;
    customZeroWord?: string;
}
/**
 * Interface defining the conversion methods.
 */
export interface IConverter {
    /**
     * Converts an input number to its word representation.
     *
     * @param {InputNumber} input - The number to convert.
     * @param {ConversionOptions} [options] - Optional conversion options to override defaults.
     * @returns {string} The word representation of the number.
     */
    convert(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a triple-digit group into its word representation.
     *
     * @param {InputNumber} num - The triple-digit number to convert.
     * @param {Lexicon} [lexicon] - Optional custom lexicon for conversion.
     * @param {string} [separator] - Optional custom separator (ignored, internal separator is fixed).
     * @returns {string} The word representation of the triple-digit group.
     */
    convertTripleToWords(num: InputNumber, lexicon?: Lexicon, separator?: string): string;
}
/**
 * HarfizerConverter class converts numbers to their Persian word representation.
 * It supports dynamic configuration and provides a static shortcut method for quick usage.
 */
export declare class HarfizerConverter implements IConverter {
    private config;
    private static readonly DEFAULT_SEPARATOR;
    private static readonly ZERO_WORD;
    private static readonly NEGATIVE_WORD;
    private static readonly DEFAULT_LEXICON;
    private static readonly DEFAULT_DECIMAL_SUFFIXES;
    /**
     * Constructor with dynamic configuration.
     *
     * @param {ConversionOptions} [config] - Global configuration options.
     */
    constructor(config?: ConversionOptions);
    /**
     * Splits the input number (as a string) into groups of three digits.
     *
     * @param {number | string} num - The number to split.
     * @returns {string[]} An array of triple-digit groups.
     */
    private static splitIntoTriples;
    /**
     * Converts a triple-digit group into words using an optional custom lexicon.
     * This method always uses the fixed internal separator (" و ").
     *
     * @param {InputNumber} num - The triple-digit group to convert.
     * @param {Lexicon} [lexicon] - Optional custom lexicon.
     * @param {string} [_separator] - Optional custom separator (ignored).
     * @returns {string} The word representation of the triple-digit group.
     */
    convertTripleToWords(num: InputNumber, lexicon?: Lexicon, _separator?: string): string;
    /**
     * Converts the fractional part of a number into words using optional custom decimal suffixes.
     *
     * @param {string} fraction - The fractional part as a string.
     * @param {string[]} [decimalSuffixes] - Optional custom decimal suffixes.
     * @returns {string} The word representation of the fractional part.
     */
    private convertFractionalPart;
    /**
     * Main conversion method that converts a number into its word representation.
     * It validates the input, removes thousand separators, and supports dynamic configuration.
     *
     * @param {InputNumber} input - The number to convert.
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The word representation of the input number.
     * @throws {Error} Throws an error if the input format is invalid, the number is too large, or out of range.
     */
    convert(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Returns the default separator from the configuration or default constant.
     *
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The separator string.
     */
    private getSeparator;
    /**
     * Static helper method for quick conversion.
     *
     * @param {InputNumber} input - The number to convert.
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The word representation of the number.
     */
    static toWords(input: InputNumber, options?: ConversionOptions): string;
}
