"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanishLanguagePlugin = void 0;
class SpanishLanguagePlugin {
    /**
     * Converts a number less than 1000 into its Spanish textual representation.
     * Handles numbers between 21 and 29 using a special concatenated form ("veintiuno").
     *
     * @param n The number to convert.
     * @returns The Spanish textual representation of the number.
     */
    convertBelowThousand(n) {
        let result = "";
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        let remainderText = "";
        // Process remainder (tens and units)
        if (remainder > 0) {
            if (remainder < 10) {
                remainderText = SpanishLanguagePlugin.UNITS[remainder];
            }
            else if (remainder < 20) {
                remainderText = SpanishLanguagePlugin.TEENS[remainder - 10];
            }
            else {
                const tens = Math.floor(remainder / 10);
                const unit = remainder % 10;
                if (tens === 2 && unit > 0) {
                    // Special case for 21-29
                    const veintiForms = [
                        "veinte",
                        "veintiuno",
                        "veintidós",
                        "veintitrés",
                        "veinticuatro",
                        "veinticinco",
                        "veintiséis",
                        "veintisiete",
                        "veintiocho",
                        "veintinueve",
                    ];
                    remainderText = veintiForms[unit];
                }
                else {
                    remainderText = SpanishLanguagePlugin.TENS[tens];
                    if (unit > 0) {
                        remainderText += " y " + SpanishLanguagePlugin.UNITS[unit];
                    }
                }
            }
        }
        // Process hundreds
        if (hundreds > 0) {
            if (hundreds === 1) {
                result = remainder === 0 ? "cien" : "ciento";
            }
            else {
                result = SpanishLanguagePlugin.HUNDREDS[hundreds];
            }
            if (remainderText) {
                result += " " + remainderText;
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
     * @param num The number or string to split.
     * @returns An array of three-digit groups.
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
     * Converts a three-digit number (or fewer) into its Spanish textual form.
     *
     * @param num The number to convert.
     * @returns The textual representation of the number.
     */
    convertTripleToWords(num) {
        const value = typeof num === "bigint" ? Number(num) : parseInt(num.toString(), 10);
        if (value === 0)
            return "";
        return this.convertBelowThousand(value);
    }
    /**
     * Converts a number (integer or decimal, possibly negative) into its Spanish textual form.
     * Handles custom options and converts the fractional part digit-by-digit using "punto".
     *
     * @param input The number to convert.
     * @param options Optional configuration for custom words and separators.
     * @returns The Spanish textual representation of the number.
     * @throws Error if the input format is invalid or exceeds the allowed range.
     */
    convertNumber(input, options) {
        const effectiveOptions = { ...options };
        const zeroWord = effectiveOptions.customZeroWord || SpanishLanguagePlugin.ZERO_WORD;
        const negativeWord = effectiveOptions.customNegativeWord ||
            SpanishLanguagePlugin.NEGATIVE_WORD;
        const separator = effectiveOptions.customSeparator ||
            SpanishLanguagePlugin.DEFAULT_SEPARATOR;
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
        const groups = SpanishLanguagePlugin.splitIntoTriples(integerPart);
        const wordParts = [];
        // Process each group of three digits
        for (let i = 0; i < groups.length; i++) {
            const converted = this.convertTripleToWords(groups[i]);
            if (converted !== "") {
                const scaleIndex = groups.length - i - 1;
                let scaleWord = "";
                if (scaleIndex > 0) {
                    scaleWord = SpanishLanguagePlugin.SCALE[scaleIndex];
                    if (scaleWord === "millón" && parseInt(groups[i], 10) > 1) {
                        scaleWord = "millones"; // fix
                    }
                }
                wordParts.push(converted + (scaleWord ? " " + scaleWord : ""));
            }
        }
        let result = wordParts.join(separator);
        // Process fractional part
        if (fractionalPart.length > 0) {
            const digitNames = [
                "cero",
                "uno",
                "dos",
                "tres",
                "cuatro",
                "cinco",
                "seis",
                "siete",
                "ocho",
                "nueve",
            ];
            const fracTokens = fractionalPart
                .split("")
                .map((d) => digitNames[parseInt(d, 10)]);
            result += separator + "punto" + separator + fracTokens.join(separator);
        }
        // Add negative word if applicable
        if (isNegative) {
            result = negativeWord + (result ? separator + result : "");
        }
        return result;
    }
    /**
     * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
     * into its Spanish textual representation.
     *
     * @param dateStr The date string to convert.
     * @param calendar The calendar type (only "gregorian" supported for Spanish).
     * @returns The Spanish textual representation of the date.
     * @throws Error if the format is invalid or if the month is out of range.
     */
    convertDateToWords(dateStr, calendar = "gregorian") {
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
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ];
        const monthName = monthNames[monthNum - 1];
        const dayWords = this.convertNumber(dayStr);
        const yearWords = this.convertNumber(yearStr);
        return `${dayWords} de ${monthName} de ${yearWords}`;
    }
    /**
     * Converts a time string in "HH:mm" format to its Spanish textual representation.
     *
     * @param timeStr The time string to convert.
     * @returns The Spanish textual representation of the time.
     * @throws Error if the format is invalid or if hours/minutes are out of range.
     */
    convertTimeToWords(timeStr) {
        const parts = timeStr.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid time format. Expected format 'HH:mm'.");
        }
        const [hourStr, minuteStr] = parts;
        let hour = parseInt(hourStr, 10);
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
        // Convert hour to 12-hour format for natural phrasing
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const hourWords = this.convertNumber(hour12);
        const minuteWords = this.convertNumber(minute);
        if (minute === 0) {
            return hour12 === 1
                ? `Es la una en punto`
                : `Son las ${hourWords} en punto`;
        }
        else {
            return hour12 === 1
                ? `Es la una y ${minuteWords} minutos`
                : `Son las ${hourWords} y ${minuteWords} minutos`;
        }
    }
}
exports.SpanishLanguagePlugin = SpanishLanguagePlugin;
/**
 * Default separator for joining tokens.
 */
SpanishLanguagePlugin.DEFAULT_SEPARATOR = " ";
/**
 * The word for zero in Spanish.
 */
SpanishLanguagePlugin.ZERO_WORD = "cero";
/**
 * The word for negative numbers in Spanish.
 */
SpanishLanguagePlugin.NEGATIVE_WORD = "menos";
/**
 * Scale units in Spanish for grouping numbers.
 * "mil" remains invariable; "millón" is singular and "millones" is plural.
 */
SpanishLanguagePlugin.SCALE = [
    "",
    "mil",
    "millón",
    "mil millones",
    "billón",
    "billones",
];
// Lexicons for number conversion.
SpanishLanguagePlugin.UNITS = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
];
SpanishLanguagePlugin.TEENS = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
];
SpanishLanguagePlugin.TENS = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
];
SpanishLanguagePlugin.HUNDREDS = [
    "",
    "cien",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
];
