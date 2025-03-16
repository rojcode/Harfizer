"use strict";
/**
 * @fileoverview
 * The ChineseLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * Chinese textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: Since the Persian solar calendar is specific to Persian, for Chinese,
 * the Gregorian calendar is used and dates are formatted as "YYYY年MM月DD日".
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChineseLanguagePlugin = void 0;
class ChineseLanguagePlugin {
    /**
     * Converts a number less than 10,000 into its Chinese textual representation.
     *
     * @param {number} n - Number less than 10,000.
     * @returns {string} The Chinese numeral representation.
     *
     * Examples:
     *   7    => "七"
     *   15   => "十五"
     *   42   => "四十二"
     *   300  => "三百"
     *   456  => "四百五十六"
     */
    convertBelowTenThousand(n) {
        const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        let result = "";
        if (n < 10) {
            return digits[n];
        }
        if (n < 100) {
            const tens = Math.floor(n / 10);
            const unit = n % 10;
            if (n === 10) {
                return "十";
            }
            // For numbers between 11 and 19, omit "一" before "十"
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
            result = digits[hundreds] + "百";
            if (remainder === 0) {
                return result;
            }
            // If remainder is less than 10, insert "零"
            if (remainder < 10) {
                result += "零" + this.convertBelowTenThousand(remainder);
            }
            else {
                // If tens digit is zero, also insert "零"
                if (Math.floor(remainder / 10) === 0) {
                    result += "零" + this.convertBelowTenThousand(remainder);
                }
                else {
                    result += this.convertBelowTenThousand(remainder);
                }
            }
            return result;
        }
        if (n < 10000) {
            const thousands = Math.floor(n / 1000);
            const remainder = n % 1000;
            result = thousands === 1 ? "千" : digits[thousands] + "千";
            if (remainder === 0) {
                return result;
            }
            // If remainder < 100, may need a "零"
            if (remainder < 100) {
                result += "零" + this.convertBelowTenThousand(remainder);
            }
            else {
                result += this.convertBelowTenThousand(remainder);
            }
            return result;
        }
        return "";
    }
    /**
     * Converts a group of up to 4 digits (as InputNumber) into its Chinese textual representation.
     * This method is required by the LanguagePlugin interface.
     *
     * @param {InputNumber} num - The number (up to 4 digits) to convert.
     * @param {any} [lexicon] - Ignored in Chinese conversion.
     * @param {string} [_separator] - Ignored in Chinese conversion.
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
     * Converts a given number (integer or decimal, possibly negative) into its Chinese textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "点".
     *
     * @param {InputNumber} input - The number to be converted.
     * @param {ConversionOptions} [options] - Supported options:
     *         - customZeroWord: override the default word for zero.
     *         - customNegativeWord: override the default negative word.
     *         - customSeparator: override the default separator between tokens.
     * @returns {string} The Chinese textual representation of the number.
     * @throws {Error} If the input format is invalid or if the number exceeds allowed range.
     */
    convertNumber(input, options) {
        const effectiveOptions = { ...options };
        const zeroWord = effectiveOptions.customZeroWord || ChineseLanguagePlugin.ZERO_WORD;
        const negativeWord = effectiveOptions.customNegativeWord ||
            ChineseLanguagePlugin.NEGATIVE_WORD;
        const separator = effectiveOptions.customSeparator ||
            ChineseLanguagePlugin.DEFAULT_SEPARATOR;
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
        // Safety check for integer length.
        if (integerPart.length > 66) {
            throw new Error("Error: Out of range.");
        }
        // Split integer part into groups of 4 digits.
        const groups = ChineseLanguagePlugin.splitIntoQuadruples(integerPart);
        const tokens = [];
        const scale = ChineseLanguagePlugin.SCALE;
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
        // Process fractional part: convert each digit using Chinese numerals.
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
     * into its Chinese textual representation.
     * The output format is "YYYY年MM月DD日", where each part is converted using convertNumber.
     *
     * @param {string} dateStr - The date string to be converted.
     * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for Chinese.
     * @returns {string} The Chinese textual form of the date.
     * @throws {Error} If the format is invalid or if the month is out of range.
     */
    convertDateToWords(dateStr, calendar = "gregorian") {
        // For Chinese, we use the Gregorian calendar and format as "YYYY年MM月DD日".
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
     * Converts a time string in "HH:mm" format to its Chinese textual representation.
     * The output format is "<hour>时<minute>分". If minute is zero, only "<hour>时" is returned.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The Chinese textual representation of the time.
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
        let result = `${hourWords}时`;
        if (minute !== 0) {
            const minuteWords = this.convertNumber(minute);
            result += `${minuteWords}分`;
        }
        return result;
    }
}
exports.ChineseLanguagePlugin = ChineseLanguagePlugin;
/**
 * Default separator used to join tokens.
 */
ChineseLanguagePlugin.DEFAULT_SEPARATOR = " ";
/**
 * Chinese word for zero.
 */
ChineseLanguagePlugin.ZERO_WORD = "零";
/**
 * Word for negative numbers.
 */
ChineseLanguagePlugin.NEGATIVE_WORD = "负";
/**
 * Large scale units in Chinese for grouping by 4 digits.
 * For example: 10^0, 10^4, 10^8, 10^12, ...
 */
ChineseLanguagePlugin.SCALE = [
    "", // 10^0
    "万", // 10^4
    "亿", // 10^8
    "兆", // 10^12
];
