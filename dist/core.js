"use strict";
/**
 * @fileoverview
 * The core module provides fundamental types, interfaces, and the CoreConverter class.
 * It delegates all number/date/time conversion processes to a given language plugin.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreConverter = void 0;
/**
 * CoreConverter acts as a bridge between the calling code and a specified LanguagePlugin.
 * It delegates all conversion tasks (number, date, time) to the given plugin.
 */
class CoreConverter {
    /**
     * @constructor
     * @param {LanguagePlugin} plugin - An instance of a language plugin implementing all required methods.
     */
    constructor(plugin) {
        this.plugin = plugin;
    }
    /**
     * Converts a number into words by delegating to the plugin's convertNumber method.
     *
     * @param {InputNumber} input             - The number to be converted.
     * @param {ConversionOptions} [options]   - Optional configuration for the conversion process.
     * @returns {string} The word-based representation of the number.
     */
    convertNumber(input, options) {
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
    convertTripleToWords(num, lexicon, separator) {
        return this.plugin.convertTripleToWords(num, lexicon, separator);
    }
    /**
     * Converts a date string to words using the plugin's convertDateToWords method.
     *
     * @param {string} dateStr                     - The date string ("YYYY/MM/DD" or "YYYY-MM-DD").
     * @param {"jalali" | "gregorian"} [calendar]  - The calendar system to use (default is "jalali").
     * @returns {string} The textual representation of the date in the plugin's language.
     */
    convertDateToWords(dateStr, calendar) {
        return this.plugin.convertDateToWords(dateStr, calendar);
    }
    /**
     * Converts a time string ("HH:mm") to words using the plugin's convertTimeToWords method.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The textual form of the time.
     */
    convertTimeToWords(timeStr) {
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
    static toWords(plugin, input, options) {
        return plugin.convertNumber(input, options);
    }
}
exports.CoreConverter = CoreConverter;
