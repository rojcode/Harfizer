"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarfizerConverter = void 0;
/**
 * HarfizerConverter class converts numbers to their Persian word representation.
 * It supports dynamic configuration and provides a static shortcut method for quick usage.
 */
class HarfizerConverter {
    /**
     * Constructor with dynamic configuration.
     *
     * @param {ConversionOptions} [config] - Global configuration options.
     */
    constructor(config) {
        this.config = config ?? {};
    }
    /**
     * Splits the input number (as a string) into groups of three digits.
     *
     * @param {number | string} num - The number to split.
     * @returns {string[]} An array of triple-digit groups.
     */
    static splitIntoTriples(num) {
        let str = typeof num === "number" ? num.toString() : num;
        const mod = str.length % 3;
        if (mod === 1) {
            str = `00${str}`;
        }
        else if (mod === 2) {
            str = `0${str}`;
        }
        return str.replace(/\d{3}(?=\d)/g, "$&*").split("*");
    }
    /**
     * Converts a triple-digit group into words using an optional custom lexicon.
     * This method always uses the fixed internal separator (" و ").
     *
     * @param {InputNumber} num - The triple-digit group to convert.
     * @param {Lexicon} [lexicon] - Optional custom lexicon.
     * @param {string} [_separator] - Optional custom separator (ignored).
     * @returns {string} The word representation of the triple-digit group.
     */
    convertTripleToWords(num, lexicon, _separator) {
        const localLexicon = lexicon ?? HarfizerConverter.DEFAULT_LEXICON;
        const internalSeparator = HarfizerConverter.DEFAULT_SEPARATOR;
        const numStr = typeof num === "bigint" ? num.toString() : num.toString();
        const value = parseInt(numStr, 10);
        if (value === 0) {
            return "";
        }
        if (value < 10) {
            return localLexicon[0][value];
        }
        if (value <= 20) {
            return localLexicon[1][value - 10];
        }
        if (value < 100) {
            const unit = value % 10;
            const tens = Math.floor(value / 10);
            if (unit > 0) {
                return (localLexicon[2][tens] + internalSeparator + localLexicon[0][unit]);
            }
            return localLexicon[2][tens];
        }
        const unit = value % 10;
        const hundreds = Math.floor(value / 100);
        const tens = Math.floor((value % 100) / 10);
        const parts = [localLexicon[3][hundreds]];
        const remainder = tens * 10 + unit;
        if (remainder === 0) {
            return parts.join(internalSeparator);
        }
        if (remainder < 10) {
            parts.push(localLexicon[0][remainder]);
        }
        else if (remainder <= 20) {
            parts.push(localLexicon[1][remainder - 10]);
        }
        else {
            parts.push(localLexicon[2][tens]);
            if (unit > 0) {
                parts.push(localLexicon[0][unit]);
            }
        }
        return parts.join(internalSeparator);
    }
    /**
     * Converts the fractional part of a number into words using optional custom decimal suffixes.
     *
     * @param {string} fraction - The fractional part as a string.
     * @param {string[]} [decimalSuffixes] - Optional custom decimal suffixes.
     * @returns {string} The word representation of the fractional part.
     */
    convertFractionalPart(fraction, decimalSuffixes) {
        const localDecimalSuffixes = decimalSuffixes ?? HarfizerConverter.DEFAULT_DECIMAL_SUFFIXES;
        fraction = fraction.replace(/0*$/, "");
        if (fraction === "") {
            return "";
        }
        if (fraction.length > 11) {
            fraction = fraction.substr(0, 11);
        }
        return (" ممیز " +
            this.convert(fraction, { customDecimalSuffixes: localDecimalSuffixes }) +
            " " +
            localDecimalSuffixes[fraction.length]);
    }
    /**
     * Main conversion method that converts a number into its word representation.
     * It validates the input, removes thousand separators, and supports dynamic configuration.
     *
     * @param {InputNumber} input - The number to convert.
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The word representation of the input number.
     * @throws {Error} Throws an error if the input format is invalid, the number is too large, or out of range.
     */
    convert(input, options) {
        // Merge dynamic configuration with method-specific options.
        const effectiveOptions = { ...this.config, ...options };
        // Convert input to string.
        let rawInput = typeof input === "bigint" ? input.toString() : input.toString().trim();
        // Check for negative sign and remove it while preserving it.
        let isNeg = false;
        if (rawInput.startsWith("-")) {
            isNeg = true;
            rawInput = "-" + rawInput.slice(1).replace(/[,\s-]/g, "");
        }
        else {
            rawInput = rawInput.replace(/[,\s-]/g, "");
        }
        // Validate input: ensure it contains only digits (with optional negative sign) and a dot.
        if (!/^-?\d+(\.\d+)?$/.test(rawInput)) {
            throw new Error("Error: Invalid input format.");
        }
        const separator = effectiveOptions.customSeparator ?? HarfizerConverter.DEFAULT_SEPARATOR;
        const lexicon = effectiveOptions.customLexicon ?? HarfizerConverter.DEFAULT_LEXICON;
        const decimalSuffixes = effectiveOptions.customDecimalSuffixes ??
            HarfizerConverter.DEFAULT_DECIMAL_SUFFIXES;
        const zeroWord = effectiveOptions.customZeroWord ?? HarfizerConverter.ZERO_WORD;
        const negativeWord = effectiveOptions.customNegativeWord ?? HarfizerConverter.NEGATIVE_WORD;
        // Determine if the number is negative and remove the negative sign.
        let isNegative = isNeg;
        if (rawInput.startsWith("-")) {
            isNegative = true;
            rawInput = rawInput.substring(1);
        }
        // Determine if the number is a decimal or a big integer.
        let numericValue;
        if (rawInput.includes(".")) {
            numericValue = parseFloat(rawInput);
        }
        else {
            try {
                numericValue = BigInt(rawInput);
            }
            catch (e) {
                throw new Error("Error: The number is too large.");
            }
        }
        if ((typeof numericValue === "number" && numericValue === 0) ||
            (typeof numericValue === "bigint" && numericValue === 0n)) {
            return zeroWord;
        }
        // Split input into integer and fractional parts.
        let inputStr = rawInput;
        let fractionPart = "";
        const pointIndex = inputStr.indexOf(".");
        if (pointIndex > -1) {
            fractionPart = inputStr.substring(pointIndex + 1);
            inputStr = inputStr.substring(0, pointIndex);
        }
        if (inputStr.length > 66) {
            throw new Error("Error: Out of range.");
        }
        const triples = HarfizerConverter.splitIntoTriples(inputStr);
        const wordParts = [];
        for (let i = 0; i < triples.length; i++) {
            const converted = this.convertTripleToWords(triples[i], lexicon, undefined // Use the fixed internal separator
            );
            if (converted !== "") {
                // Append the appropriate scale from lexicon[4]
                wordParts.push(converted + lexicon[4][triples.length - (i + 1)]);
            }
        }
        if (fractionPart.length > 0) {
            fractionPart = this.convertFractionalPart(fractionPart, decimalSuffixes);
        }
        // Ensure that the negative word ends with a space.
        const negPrefix = isNegative && !negativeWord.endsWith(" ")
            ? negativeWord + " "
            : negativeWord;
        return ((isNegative ? negPrefix : "") + wordParts.join(separator) + fractionPart);
    }
    /**
     * Converts a date string (Solar/Jalali or Gregorian) to its word representation.
     *
     * @param {string} dateStr - The date string in the format 'YYYY/MM/DD' or 'YYYY-MM-DD'.
     * @param {'jalali' | 'gregorian'} [calendar='jalali'] - The calendar type, either 'jalali' or 'gregorian'.
     * @returns {string} The word representation of the date.
     * @throws {Error} Throws an error if the date format is invalid or the month is out of range.
     */
    convertDateToWords(dateStr, calendar = "jalali") {
        // Split the date string by '/' or '-' and validate the format.
        const parts = dateStr.split(/[-\/]/);
        if (parts.length !== 3) {
            throw new Error("Invalid date format. Expected format 'YYYY/MM/DD' or 'YYYY-MM-DD'.");
        }
        const [yearStr, monthStr, dayStr] = parts;
        // Parse month as a number and validate it.
        const monthNum = parseInt(monthStr, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            throw new Error("Invalid month in date.");
        }
        // Define month names for Jalali and Gregorian calendars.
        const jalaliMonths = [
            "فروردین",
            "اردیبهشت",
            "خرداد",
            "تیر",
            "مرداد",
            "شهریور",
            "مهر",
            "آبان",
            "آذر",
            "دی",
            "بهمن",
            "اسفند",
        ];
        const gregorianMonths = [
            "ژانویه",
            "فوریه",
            "مارس",
            "آوریل",
            "مه",
            "ژوئن",
            "ژوئیه",
            "اوت",
            "سپتامبر",
            "اکتبر",
            "نوامبر",
            "دسامبر",
        ];
        // Get the month name based on the calendar type.
        const monthName = calendar === "gregorian"
            ? gregorianMonths[monthNum - 1]
            : jalaliMonths[monthNum - 1];
        // Convert the day and year to words using the convert method.
        const dayWords = this.convert(dayStr);
        const yearWords = this.convert(yearStr);
        // Construct and return the final word representation of the date.
        return `${dayWords} ${monthName} ${yearWords}`;
    }
    /**
     * Converts a digital time string (HH:mm) to its Persian word representation.
     *
     * @param {string} timeStr - The time string in "HH:mm" format.
     * @returns {string} The word representation of the time.
     * @throws {Error} Throws an error if the time format is invalid or if time values are out of range.
     */
    convertTimeToWords(timeStr) {
        // Split the time string using colon (":") as the separator.
        const parts = timeStr.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid time format. Expected format 'HH:mm'.");
        }
        const [hourStr, minuteStr] = parts;
        // Parse hours and minutes.
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        if (isNaN(hour) || isNaN(minute)) {
            throw new Error("Invalid time format. Hours and minutes should be numbers.");
        }
        // Validate hour and minute ranges.
        if (hour < 0 || hour > 23) {
            throw new Error("Invalid hour value. Hour should be between 0 and 23.");
        }
        if (minute < 0 || minute > 59) {
            throw new Error("Invalid minute value. Minute should be between 0 and 59.");
        }
        // Retrieve the custom time prefix from configuration or use the default "ساعت".
        const timePrefix = this.config.customTimePrefix ?? "ساعت";
        // Convert the hour and minute values to their word representations.
        const hourWords = this.convert(hour);
        const minuteWords = this.convert(minute);
        // Construct the final time string in words.
        // If minutes are zero, return only the hour part.
        if (minute === 0) {
            return `${timePrefix} ${hourWords}`;
        }
        else {
            return `${timePrefix} ${hourWords} و ${minuteWords} دقیقه`;
        }
    }
    /**
     * Returns the default separator from the configuration or default constant.
     *
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The separator string.
     */
    getSeparator(options) {
        return options?.customSeparator ?? HarfizerConverter.DEFAULT_SEPARATOR;
    }
    /**
     * Static helper method for quick conversion.
     *
     * @param {InputNumber} input - The number to convert.
     * @param {ConversionOptions} [options] - Optional conversion options.
     * @returns {string} The word representation of the number.
     */
    static toWords(input, options) {
        return new HarfizerConverter(options).convert(input);
    }
}
exports.HarfizerConverter = HarfizerConverter;
// Default constants.
HarfizerConverter.DEFAULT_SEPARATOR = " و ";
HarfizerConverter.ZERO_WORD = "صفر";
HarfizerConverter.NEGATIVE_WORD = "منفی ";
// Default lexicon for number conversion.
HarfizerConverter.DEFAULT_LEXICON = [
    ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
    [
        "ده",
        "یازده",
        "دوازده",
        "سیزده",
        "چهارده",
        "پانزده",
        "شانزده",
        "هفده",
        "هجده",
        "نوزده",
        "بیست",
    ],
    ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"],
    [
        "",
        "یکصد",
        "دویست",
        "سیصد",
        "چهارصد",
        "پانصد",
        "ششصد",
        "هفتصد",
        "هشتصد",
        "نهصد",
    ],
    [
        "",
        " هزار",
        " میلیون",
        " میلیارد",
        " بیلیون",
        " بیلیارد",
        " تریلیون",
        " تریلیارد",
        " کوآدریلیون",
        " کادریلیارد",
        " کوینتیلیون",
        " کوانتینیارد",
        " سکستیلیون",
        " سکستیلیارد",
        " سپتیلیون",
        " سپتیلیارد",
        " اکتیلیون",
        " اکتیلیارد",
        " نانیلیون",
        " نانیلیارد",
        " دسیلیون",
        " دسیلیارد",
    ],
];
// Default decimal suffixes for the fractional part.
HarfizerConverter.DEFAULT_DECIMAL_SUFFIXES = [
    "",
    "دهم",
    "صدم",
    "هزارم",
    "ده‌هزارم",
    "صد‌هزارم",
    "میلیونوم",
    "ده‌میلیونوم",
    "صدمیلیونوم",
    "میلیاردم",
    "ده‌میلیاردم",
    "صد‌‌میلیاردم",
];
