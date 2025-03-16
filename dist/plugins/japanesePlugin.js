"use strict";
/**
 * @fileoverview
 * The JapaneseLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Japanese textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: Since the Persian solar calendar is specific to Persian, for Japanese,
 * the Gregorian calendar is used and dates are formatted as "YYYY年MM月DD日".
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JapaneseLanguagePlugin = void 0;
class JapaneseLanguagePlugin {
    /**
     * Converts a number with up to 4 digits into its Japanese textual representation.
     * This function handles numbers less than 10,000.
     *
     * @param {number} n - Number less than 10,000.
     * @returns {string} The Japanese representation (using Kanji).
     *
     * Examples:
     *   7   => "七"
     *   15  => "十五"
     *   42  => "四十二"
     *   300 => "三百"
     *   456 => "四百五十六"
     */
    convertBelowTenThousand(n) {
        const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        if (n < 10) {
            return digits[n];
        }
        if (n < 100) {
            const tens = Math.floor(n / 10);
            const unit = n % 10;
            let result = "";
            if (tens === 1) {
                result = "十";
            }
            else {
                result = digits[tens] + "十";
            }
            if (unit !== 0) {
                result += digits[unit];
            }
            return result;
        }
        if (n < 1000) {
            const hundreds = Math.floor(n / 100);
            const remainder = n % 100;
            let result = "";
            if (hundreds === 1) {
                result = "百";
            }
            else {
                result = digits[hundreds] + "百";
            }
            if (remainder !== 0) {
                result += this.convertBelowTenThousand(remainder);
            }
            return result;
        }
        if (n < 10000) {
            const thousands = Math.floor(n / 1000);
            const remainder = n % 1000;
            let result = "";
            if (thousands === 1) {
                result = "千";
            }
            else {
                result = digits[thousands] + "千";
            }
            if (remainder !== 0) {
                result += this.convertBelowTenThousand(remainder);
            }
            return result;
        }
        return "";
    }
    /**
     * **Implemented to satisfy LanguagePlugin interface**
     * Converts a group of up to 4 digits (treated as a "triple" per interface)
     * into its Japanese textual representation.
     *
     * @param {InputNumber} num - The number (up to 4 digits) to convert.
     * @param {any} [lexicon] - Ignored.
     * @param {string} [_separator] - Ignored.
     * @returns {string} The textual representation.
     */
    convertTripleToWords(num, lexicon, _separator) {
        const value = typeof num === "bigint" ? Number(num) : parseInt(num.toString(), 10);
        if (value === 0)
            return "";
        return this.convertBelowTenThousand(value);
    }
    /**
     * Splits a numeric string into groups of 4 digits (from right to left).
     *
     * Example: "12345678" => ["1234", "5678"]
     *
     * @param {string | number} num - The number to be split.
     * @returns {string[]} An array of 4-digit groups.
     */
    static splitIntoQuadruples(num) {
        let str = typeof num === "number" ? num.toString() : num;
        const groups = [];
        while (str.length > 0) {
            const end = str.length;
            const start = Math.max(0, end - 4);
            groups.unshift(str.substring(start, end));
            str = str.substring(0, start);
        }
        return groups;
    }
    /**
     * Converts a given number (integer or decimal, possibly negative) into its Japanese textual form.
     * Handles custom options and converts the fractional part digit-by-digit (using "点" for decimal).
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The Japanese textual representation of the number.
     * @throws {Error} If the input format is invalid or out of allowed range.
     */
    convertNumber(input, options) {
        const effectiveOptions = { ...options };
        const zeroWord = effectiveOptions.customZeroWord || JapaneseLanguagePlugin.ZERO_WORD;
        const negativeWord = effectiveOptions.customNegativeWord ||
            JapaneseLanguagePlugin.NEGATIVE_WORD;
        const separator = effectiveOptions.customSeparator ||
            JapaneseLanguagePlugin.DEFAULT_SEPARATOR;
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
        // Limit integer part length for safety.
        if (integerPart.length > 66) {
            throw new Error("Error: Out of range.");
        }
        // Split integer part into quadruple groups.
        const groups = JapaneseLanguagePlugin.splitIntoQuadruples(integerPart);
        const tokens = [];
        const scale = JapaneseLanguagePlugin.SCALE;
        const numGroups = groups.length;
        for (let i = 0; i < numGroups; i++) {
            const groupNum = parseInt(groups[i], 10);
            if (groupNum === 0)
                continue;
            const text = this.convertBelowTenThousand(groupNum);
            const scaleIndex = numGroups - i - 1;
            let token = text;
            if (scaleIndex > 0) {
                token += scale[scaleIndex];
            }
            tokens.push(token);
        }
        let result = tokens.join(separator);
        // Process fractional part digit by digit, using the custom separator.
        if (fractionalPart.length > 0) {
            const digitNames = [
                "零",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九",
            ];
            const fracTokens = fractionalPart
                .split("")
                .map((d) => digitNames[parseInt(d, 10)]);
            result += separator + "点" + separator + fracTokens.join(separator);
        }
        if (isNegative) {
            result = negativeWord + separator + result;
        }
        return result;
    }
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its Japanese textual representation.
     * The output format is "YYYY年MM月DD日", where the year, month, and day are
     * converted using convertNumber.
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for Japanese.
     * @returns {string} The Japanese textual form of the date.
     * @throws {Error} If the format is invalid or month is out of range.
     */
    convertDateToWords(dateStr, calendar = "gregorian") {
        // For Japanese, we use the Gregorian calendar and format as "YYYY年MM月DD日".
        const parts = dateStr.split(/[-\/]/);
        if (parts.length !== 3) {
            throw new Error("Invalid date format. Expected 'YYYY/MM/DD' or 'YYYY-MM-DD'.");
        }
        const [yearStr, monthStr, dayStr] = parts;
        const monthNum = parseInt(monthStr, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            throw new Error("Invalid month in date.");
        }
        // Convert year, month, and day using convertNumber.
        const yearWords = this.convertNumber(yearStr);
        const monthWords = this.convertNumber(monthStr);
        const dayWords = this.convertNumber(dayStr);
        return `${yearWords}年${monthWords}月${dayWords}日`;
    }
    /**
     * Converts a time string in "HH:mm" format to its Japanese textual representation.
     * The output format is "<hour>時<minute>分". If minutes are zero, only "<hour>時" is returned.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The Japanese textual representation of the time.
     * @throws {Error} If the format is invalid or hours/minutes are out of range.
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
        let result = `${hourWords}時`;
        if (minute !== 0) {
            const minuteWords = this.convertNumber(minute);
            result += `${minuteWords}分`;
        }
        return result;
    }
}
exports.JapaneseLanguagePlugin = JapaneseLanguagePlugin;
/**
 * Default separator for joining parts.
 * In Japanese, numbers are usually read continuously,
 * but for clarity we use a space.
 */
JapaneseLanguagePlugin.DEFAULT_SEPARATOR = " ";
/**
 * Word for zero in Japanese (using Kanji).
 */
JapaneseLanguagePlugin.ZERO_WORD = "零";
/**
 * Word used for negative numbers.
 */
JapaneseLanguagePlugin.NEGATIVE_WORD = "マイナス";
/**
 * Large scale units in Japanese for grouping numbers by 4 digits.
 * These represent 10^4, 10^8, 10^12, etc.
 */
JapaneseLanguagePlugin.SCALE = [
    "", // 10^0
    "万", // 10^4
    "億", // 10^8
    "兆", // 10^12
    "京", // 10^16
    "垓", // 10^20
];
