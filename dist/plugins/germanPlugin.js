"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GermanLanguagePlugin = void 0;
class GermanLanguagePlugin {
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
    convertBelowThousand(n) {
        let result = "";
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        let remainderText = "";
        if (remainder > 0) {
            if (remainder < 10) {
                remainderText = GermanLanguagePlugin.UNITS[remainder];
            }
            else if (remainder < 20) {
                remainderText = GermanLanguagePlugin.TEENS[remainder - 10];
            }
            else {
                const tens = Math.floor(remainder / 10);
                const unit = remainder % 10;
                if (unit > 0) {
                    remainderText =
                        GermanLanguagePlugin.UNITS[unit] +
                            "und" +
                            GermanLanguagePlugin.TENS[tens];
                }
                else {
                    remainderText = GermanLanguagePlugin.TENS[tens];
                }
            }
        }
        if (hundreds > 0) {
            result =
                hundreds === 1
                    ? "einhundert"
                    : GermanLanguagePlugin.UNITS[hundreds] + "hundert";
            if (remainderText) {
                result += remainderText;
            }
        }
        else {
            result = remainderText;
        }
        return result;
    }
    /**
     * Splits a numeric string into groups of three digits (from right to left).
     *
     * Example: "1234567" => ["1", "234", "567"]
     *
     * @param {string | number} num - The number to be split.
     * @returns {string[]} An array of three-digit groups.
     */
    static splitIntoTriples(num) {
        let str = typeof num === "number" ? num.toString() : num;
        const groups = [];
        while (str.length > 0) {
            const end = str.length;
            const start = Math.max(0, end - 3);
            groups.unshift(str.substring(start, end));
            str = str.substring(0, start);
        }
        return groups;
    }
    /**
     * Converts a three-digit number (or fewer) into its German textual form.
     * This function is used internally to process larger numbers.
     *
     * @param {InputNumber} num - The three-digit number to convert.
     * @param {any} [lexicon] - Not used in German conversion.
     * @param {string} [_separator] - Not used in this method.
     * @returns {string} The textual representation (e.g. "vierhundertsechsundfünfzig").
     */
    convertTripleToWords(num, lexicon, _separator) {
        const value = typeof num === "bigint" ? Number(num) : parseInt(num.toString(), 10);
        if (value === 0)
            return "";
        return this.convertBelowThousand(value);
    }
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
    convertNumber(input, options) {
        const effectiveOptions = { ...options };
        const zeroWord = effectiveOptions.customZeroWord || GermanLanguagePlugin.ZERO_WORD;
        const negativeWord = effectiveOptions.customNegativeWord || GermanLanguagePlugin.NEGATIVE_WORD;
        const separator = effectiveOptions.customSeparator ||
            GermanLanguagePlugin.DEFAULT_SEPARATOR;
        let rawInput = typeof input === "bigint" ? input.toString() : input.toString().trim();
        let isNegative = false;
        if (rawInput.startsWith("-")) {
            isNegative = true;
            rawInput = rawInput.slice(1).replace(/[,\s-]/g, "");
        }
        else {
            rawInput = rawInput.replace(/[,\s-]/g, "");
        }
        if (!/^\d+(\.\d+)?$/.test(rawInput)) {
            throw new Error("Error: Invalid input format.");
        }
        if (rawInput === "0" || rawInput === "0.0") {
            return zeroWord;
        }
        // Separate integer and fractional parts.
        let integerPart = rawInput;
        let fractionalPart = "";
        const pointIndex = rawInput.indexOf(".");
        if (pointIndex > -1) {
            integerPart = rawInput.substring(0, pointIndex);
            fractionalPart = rawInput.substring(pointIndex + 1);
        }
        if (integerPart.length > 66) {
            throw new Error("Error: Out of range.");
        }
        // Break the integer part into triples.
        const triples = GermanLanguagePlugin.splitIntoTriples(integerPart);
        const wordParts = [];
        for (let i = 0; i < triples.length; i++) {
            const converted = this.convertTripleToWords(triples[i]);
            if (converted !== "") {
                const scaleIndex = triples.length - i - 1;
                let scaleWord = "";
                if (scaleIndex > 0) {
                    scaleWord = GermanLanguagePlugin.SCALE[scaleIndex];
                }
                // Append scale word with a space if applicable.
                wordParts.push(converted + (scaleWord ? " " + scaleWord : ""));
            }
        }
        let result = wordParts.join(separator);
        // Process fractional part: convert each digit using German digit names, prefix with "Komma".
        if (fractionalPart.length > 0) {
            const digitNames = [
                "null",
                "eins",
                "zwei",
                "drei",
                "vier",
                "fünf",
                "sechs",
                "sieben",
                "acht",
                "neun",
            ];
            const fracTokens = fractionalPart
                .split("")
                .map((d) => digitNames[parseInt(d, 10)]);
            result += separator + "Komma" + separator + fracTokens.join(separator);
        }
        if (isNegative) {
            result = negativeWord + separator + result;
        }
        return result;
    }
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
    convertDateToWords(dateStr, calendar = "gregorian") {
        // For English, we use the Gregorian calendar.
        const parts = dateStr.split(/[-\/]/);
        if (parts.length !== 3) {
            throw new Error("Invalid date format. Expected 'YYYY/MM/DD' or 'YYYY-MM-DD'.");
        }
        const [yearStr, monthStr, dayStr] = parts;
        const monthNum = parseInt(monthStr, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            throw new Error("Invalid month in date.");
        }
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const monthName = monthNames[monthNum - 1];
        const dayNum = parseInt(dayStr, 10);
        // Convert year using convertNumber to get full words.
        const yearWords = this.convertNumber(yearStr);
        return `${monthName} ${dayNum}, ${yearWords}`;
    }
    /**
     * Converts a time string in "HH:mm" format to its English textual representation.
     * The output format is "It is <hour> o'clock and <minute> minutes".
     * If minutes are zero, returns "It is <hour> o'clock".
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The English textual representation of the time.
     * @throws {Error} If the format is invalid or if hours/minutes are out of range.
     */
    convertTimeToWords(timeStr) {
        const parts = timeStr.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid time format. Expected format 'HH:mm'.");
        }
        const [hourStr, minuteStr] = parts;
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        if (isNaN(hour) || isNaN(minute)) {
            throw new Error("Invalid time format. Hours and minutes should be numbers.");
        }
        if (hour < 0 || hour > 23) {
            throw new Error("Invalid hour value. Hour should be between 0 and 23.");
        }
        if (minute < 0 || minute > 59) {
            throw new Error("Invalid minute value. Minute should be between 0 and 59.");
        }
        const hourWords = this.convertNumber(hour);
        const minuteWords = this.convertNumber(minute);
        // German time conversion should use German phrases.
        if (minute === 0) {
            return `Es ist ${hourWords} Uhr`;
        }
        else {
            return `Es ist ${hourWords} Uhr und ${minuteWords} Minuten`;
        }
    }
}
exports.GermanLanguagePlugin = GermanLanguagePlugin;
/**
 * Default separator for joining tokens.
 */
GermanLanguagePlugin.DEFAULT_SEPARATOR = " ";
/**
 * The word for zero in German.
 */
GermanLanguagePlugin.ZERO_WORD = "null";
/**
 * The word for negative numbers in German.
 */
GermanLanguagePlugin.NEGATIVE_WORD = "minus";
/**
 * Scale units in German for grouping numbers.
 */
GermanLanguagePlugin.SCALE = [
    "",
    "tausend",
    "Million",
    "Milliarde",
    "Billion",
    "Billiarde",
];
// Lexicons for number conversion.
GermanLanguagePlugin.UNITS = [
    "",
    "eins",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
];
GermanLanguagePlugin.TEENS = [
    "zehn",
    "elf",
    "zwölf",
    "dreizehn",
    "vierzehn",
    "fünfzehn",
    "sechzehn",
    "siebzehn",
    "achtzehn",
    "neunzehn",
];
GermanLanguagePlugin.TENS = [
    "",
    "",
    "zwanzig",
    "dreißig",
    "vierzig",
    "fünfzig",
    "sechzig",
    "siebzig",
    "achtzig",
    "neunzig",
];
