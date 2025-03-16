/**
 * @fileoverview
 * The SpanishLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Spanish textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: For Spanish, the Gregorian calendar is used, and dates are formatted
 * in a natural Spanish style.
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class SpanishLanguagePlugin implements LanguagePlugin {
    /**
     * Default separator for joining tokens.
     */
    private static readonly DEFAULT_SEPARATOR;
    /**
     * The word for zero in Spanish.
     */
    private static readonly ZERO_WORD;
    /**
     * The word for negative numbers in Spanish.
     */
    private static readonly NEGATIVE_WORD;
    /**
     * Scale units in Spanish for grouping numbers.
     * "mil" remains invariable; "millón" is singular and "millones" is plural.
     */
    private static readonly SCALE;
    private static readonly UNITS;
    private static readonly TEENS;
    private static readonly TENS;
    private static readonly HUNDREDS;
    /**
     * Converts a number less than 1000 into its Spanish textual representation.
     * Handles numbers between 21 and 29 using a special concatenated form ("veintiuno").
     *
     * @param n The number to convert.
     * @returns The Spanish textual representation of the number.
     */
    private convertBelowThousand;
    /**
     * Splits a numeric string into groups of three digits (from right to left).
     *
     * @param num The number or string to split.
     * @returns An array of three-digit groups.
     */
    private static splitIntoTriples;
    /**
     * Converts a three-digit number (or fewer) into its Spanish textual form.
     *
     * @param num The number to convert.
     * @returns The textual representation of the number.
     */
    convertTripleToWords(num: InputNumber): string;
    /**
     * Converts a number (integer or decimal, possibly negative) into its Spanish textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "punto".
     *
     * @param input The number to convert.
     * @param options Optional configuration for custom words and separators.
     * @returns The Spanish textual representation of the number.
     * @throws Error if the input format is invalid or exceeds the allowed range.
     */
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its Spanish textual representation.
     *
     * @param dateStr The date string to convert.
     * @param calendar The calendar type (only "gregorian" supported for Spanish).
     * @returns The Spanish textual representation of the date.
     * @throws Error if the format is invalid or if the month is out of range.
     */
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    /**
     * Converts a time string in "HH:mm" format to its Spanish textual representation.
     *
     * @param timeStr The time string to convert.
     * @returns The Spanish textual representation of the time.
     * @throws Error if the format is invalid or if hours/minutes are out of range.
     */
    convertTimeToWords(timeStr: string): string;
}
