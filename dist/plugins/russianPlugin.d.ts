/**
 * @fileoverview
 * The RussianLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Russian textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: The Persian solar calendar is specific to Persian; for Russian,
 * the Gregorian calendar is used with Russian month names.
 */
import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";
export declare class RussianLanguagePlugin implements LanguagePlugin {
    private static readonly DEFAULT_SEPARATOR;
    private static readonly ZERO_WORD;
    private static readonly NEGATIVE_WORD;
    private static readonly SCALE;
    private static readonly DIGITS;
    private static readonly TEENS;
    private static readonly TENS;
    private static readonly HUNDREDS;
    convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string;
    private convertBelowThousand;
    private static splitIntoTriples;
    private convertYear;
    convertNumber(input: InputNumber, options?: ConversionOptions): string;
    convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string;
    convertTimeToWords(timeStr: string): string;
    private getHourSuffix;
    private getMinuteSuffix;
}
