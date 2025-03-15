/**
 * @fileoverview
 * The PersianLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times to their
 * Persian textual representation. It handles integer and decimal numbers,
 * negative values, date strings (Jalali or Gregorian), and time strings (HH:mm).
 */

import {
  ConversionOptions,
  InputNumber,
  Lexicon,
  LanguagePlugin,
} from "../core";

/**
 * PersianLanguagePlugin is responsible for converting Persian numbers,
 * dates, and times into their textual representations using predefined
 * lexicons and optional custom settings.
 */
export class PersianLanguagePlugin implements LanguagePlugin {
  /**
   * Default separator string used to join parts of numbers (e.g. " و ").
   * In Persian, this is typically the word "و" (meaning "and").
   */
  private static readonly DEFAULT_SEPARATOR: string = " و ";

  /**
   * The word used for zero in Persian.
   */
  private static readonly ZERO_WORD: string = "صفر";

  /**
   * The word used for representing negative numbers in Persian.
   */
  private static readonly NEGATIVE_WORD: string = "منفی ";

  /**
   * The default lexicon (word list) for Persian numbers.
   *
   * Structure explanation:
   * - [0]: single digits (0-9)
   * - [1]: numbers from 10 to 20
   * - [2]: tens (20, 30, 40, ...)
   * - [3]: hundreds (100, 200, ...)
   * - [4]: large scale units (thousand, million, billion, etc.)
   */
  private static readonly DEFAULT_LEXICON: Lexicon = [
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

  /**
   * Default suffixes used for fractional parts in Persian (e.g. "دهم" for 0.1, "صدم" for 0.01, etc.).
   */
  private static readonly DEFAULT_DECIMAL_SUFFIXES: string[] = [
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

  /**
   * Converts a three-digit number (or fewer digits) into its Persian textual form.
   * This function is intended to be used internally when processing larger numbers
   * in multiple three-digit chunks.
   *
   * @param {InputNumber} num - The three-digit number to convert.
   * @param {Lexicon} [lexicon] - Optional custom lexicon; defaults to PersianLanguagePlugin.DEFAULT_LEXICON.
   * @param {string} [_separator] - An optional parameter that is not used in this method.
   * @returns {string} The textual representation of the three-digit number (e.g. "یکصد و بیست و سه").
   */
  public convertTripleToWords(
    num: InputNumber,
    lexicon?: Lexicon,
    _separator?: string
  ): string {
    // Use either the custom lexicon (if provided) or the default one.
    const localLexicon = lexicon ?? PersianLanguagePlugin.DEFAULT_LEXICON;

    // Default internal separator (e.g. " و ").
    const internalSeparator = PersianLanguagePlugin.DEFAULT_SEPARATOR;

    // Convert input to a string and parse as a base-10 integer.
    const numStr: string =
      typeof num === "bigint" ? num.toString() : num.toString();
    const value: number = parseInt(numStr, 10);

    // If the value is 0, return an empty string.
    if (value === 0) {
      return "";
    }

    // For values under 10, return the single-digit lexicon entry.
    if (value < 10) {
      return localLexicon[0][value];
    }

    // For values <= 20, return the teen lexicon entry (10 to 20).
    if (value <= 20) {
      return localLexicon[1][value - 10];
    }

    // If the value is less than 100, construct the tens and possibly the units.
    if (value < 100) {
      const unit: number = value % 10;
      const tens: number = Math.floor(value / 10);
      if (unit > 0) {
        return (
          localLexicon[2][tens] + internalSeparator + localLexicon[0][unit]
        );
      }
      return localLexicon[2][tens];
    }

    // For values of 100 up to 999, determine hundreds, tens, and units.
    const unit: number = value % 10;
    const hundreds: number = Math.floor(value / 100);
    const tens: number = Math.floor((value % 100) / 10);
    const parts: string[] = [localLexicon[3][hundreds]];
    const remainder: number = tens * 10 + unit;

    // If the last two digits (remainder) are zero, just return the hundreds part.
    if (remainder === 0) {
      return parts.join(internalSeparator);
    }

    // If remainder is under 10, simply add the digit from the single-digit lexicon.
    if (remainder < 10) {
      parts.push(localLexicon[0][remainder]);
    }
    // If remainder is <= 20, use the teen entries (e.g. "یازده", "دوازده").
    else if (remainder <= 20) {
      parts.push(localLexicon[1][remainder - 10]);
    }
    // Otherwise, we have a tens place and possibly a units place to handle.
    else {
      parts.push(localLexicon[2][tens]);
      if (unit > 0) {
        parts.push(localLexicon[0][unit]);
      }
    }

    return parts.join(internalSeparator);
  }

  /**
   * A helper function for converting the fractional part of a decimal number to words.
   *
   * @param {string} fraction - The fractional part of the number (e.g. "456" in "123.456").
   * @param {string[]} [decimalSuffixes] - Custom suffixes for fractional parts;
   *                                       defaults to PersianLanguagePlugin.DEFAULT_DECIMAL_SUFFIXES.
   * @returns {string} A string representing the fractional part in Persian (e.g. " ممیز چهارصد و پنجاه و شش هزارم").
   */
  private convertFractionalPart(
    fraction: string,
    decimalSuffixes?: string[]
  ): string {
    // Use default decimal suffixes if no custom array is provided.
    const localDecimalSuffixes =
      decimalSuffixes ?? PersianLanguagePlugin.DEFAULT_DECIMAL_SUFFIXES;

    // Remove trailing zeros in the fractional part.
    fraction = fraction.replace(/0*$/, "");
    if (fraction === "") {
      return "";
    }

    // Limit the fractional length to a maximum of 11 digits.
    if (fraction.length > 11) {
      fraction = fraction.substr(0, 11);
    }

    // Convert the trimmed fractional part to words, then add the suffix (e.g. صدم/هزارم).
    return (
      " ممیز " +
      this.convertNumber(fraction) +
      " " +
      localDecimalSuffixes[fraction.length]
    );
  }

  /**
   * Converts a given number (integer or decimal, possibly negative) into its Persian textual form.
   * This method also handles optional custom configurations, such as custom separator, lexicon,
   * decimal suffixes, and negative/zero words.
   *
   * @param {InputNumber} input - The number to be converted. It can be a string, a number, or a bigint.
   * @param {ConversionOptions} [options] - Optional configuration for customizing the conversion process.
   * @returns {string} The Persian word representation of the given number.
   * @throws {Error} If the input format is invalid or if the number exceeds the allowed range (more than 66 digits).
   */
  public convertNumber(
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    // Merge the user-provided options with any defaults.
    const effectiveOptions: ConversionOptions = { ...options };

    // Convert input to string and remove leading/trailing spaces.
    let rawInput: string =
      typeof input === "bigint" ? input.toString() : input.toString().trim();

    // Check for negative sign and store that state in `isNeg`.
    // Also remove commas, spaces, and dashes.
    let isNeg = false;
    if (rawInput.startsWith("-")) {
      isNeg = true;
      rawInput = "-" + rawInput.slice(1).replace(/[,\s-]/g, "");
    } else {
      rawInput = rawInput.replace(/[,\s-]/g, "");
    }

    // Validate input format: it should be a valid integer or decimal number, with an optional leading "-".
    if (!/^-?\d+(\.\d+)?$/.test(rawInput)) {
      throw new Error("Error: Invalid input format.");
    }

    // Extract relevant options or set defaults.
    const separator =
      effectiveOptions.customSeparator ??
      PersianLanguagePlugin.DEFAULT_SEPARATOR;
    const lexicon =
      effectiveOptions.customLexicon ?? PersianLanguagePlugin.DEFAULT_LEXICON;
    const decimalSuffixes =
      effectiveOptions.customDecimalSuffixes ??
      PersianLanguagePlugin.DEFAULT_DECIMAL_SUFFIXES;
    const zeroWord =
      effectiveOptions.customZeroWord ?? PersianLanguagePlugin.ZERO_WORD;
    const negativeWord =
      effectiveOptions.customNegativeWord ??
      PersianLanguagePlugin.NEGATIVE_WORD;

    // If the input still starts with "-", remove the sign from rawInput for further processing.
    let isNegative = isNeg;
    if (rawInput.startsWith("-")) {
      isNegative = true;
      rawInput = rawInput.substring(1);
    }

    // Distinguish between decimal (float) and potentially large integer (bigint).
    let numericValue: number | bigint;
    if (rawInput.includes(".")) {
      numericValue = parseFloat(rawInput);
    } else {
      try {
        numericValue = BigInt(rawInput);
      } catch (e) {
        throw new Error("Error: The number is too large.");
      }
    }

    // If the number is zero, return the word for zero.
    if (
      (typeof numericValue === "number" && numericValue === 0) ||
      (typeof numericValue === "bigint" && numericValue === 0n)
    ) {
      return zeroWord;
    }

    // Split into integer and fractional parts if needed.
    let inputStr: string = rawInput;
    let fractionPart: string = "";
    const pointIndex: number = inputStr.indexOf(".");
    if (pointIndex > -1) {
      fractionPart = inputStr.substring(pointIndex + 1);
      inputStr = inputStr.substring(0, pointIndex);
    }

    // Check the length to ensure it doesn't exceed 66 digits for safety.
    if (inputStr.length > 66) {
      throw new Error("Error: Out of range.");
    }

    // Break the integer part into triples (e.g. ["001", "234", "567"]).
    const triples: string[] = PersianLanguagePlugin.splitIntoTriples(inputStr);
    const wordParts: string[] = [];

    // Convert each triple to words, then append the corresponding scale (e.g. هزار, میلیون).
    for (let i = 0; i < triples.length; i++) {
      const converted: string = this.convertTripleToWords(triples[i], lexicon);
      if (converted !== "") {
        // lexicon[4] contains the large scale units at indexes.
        wordParts.push(converted + lexicon[4][triples.length - (i + 1)]);
      }
    }

    // Handle the fractional part if present (e.g. .456).
    if (fractionPart.length > 0) {
      fractionPart = this.convertFractionalPart(fractionPart, decimalSuffixes);
    }

    // If the negative word doesn't end with a space, add one.
    const negPrefix =
      isNegative && !negativeWord.endsWith(" ")
        ? negativeWord + " "
        : negativeWord;

    // Build the final result, combining negative prefix (if needed), the integer words, and the fractional part.
    return (
      (isNegative ? negPrefix : "") + wordParts.join(separator) + fractionPart
    );
  }

  /**
   * A static helper method to split a numeric string into groups of three digits.
   * Example: "1234567" => ["001","234","567"]
   *
   * @param {number | string} num - The number to be split into triples.
   * @returns {string[]} An array of three-digit strings.
   */
  private static splitIntoTriples(num: number | string): string[] {
    // Convert to string if it's a number.
    let str: string = typeof num === "number" ? num.toString() : num;
    const mod = str.length % 3;

    // If length is not a multiple of 3, prepend zeros.
    if (mod === 1) {
      str = `00${str}`;
    } else if (mod === 2) {
      str = `0${str}`;
    }

    // Insert asterisks between every three digits, then split by asterisk.
    return str.replace(/\d{3}(?=\d)/g, "$&*").split("*");
  }

  /**
   * Converts a date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format) into a textual representation in Persian.
   * It supports both Jalali (default) and Gregorian calendars.
   *
   * @param {string} dateStr - The date string to be converted (e.g. "1402/05/17" or "2023-04-05").
   * @param {"jalali" | "gregorian"} [calendar="jalali"] - Specifies whether the date is Jalali or Gregorian.
   * @returns {string} The Persian textual form of the given date (e.g. "هفدهم مرداد یک هزار و چهارصد و دو").
   * @throws {Error} If the format is invalid or if the month is out of range (not between 1 and 12).
   */
  public convertDateToWords(
    dateStr: string,
    calendar: "jalali" | "gregorian" = "jalali"
  ): string {
    // Split date by hyphen or slash.
    const parts = dateStr.split(/[-\/]/);
    if (parts.length !== 3) {
      throw new Error(
        "Invalid date format. Expected format 'YYYY/MM/DD' or 'YYYY-MM-DD'."
      );
    }

    // Parse and validate month.
    const [yearStr, monthStr, dayStr] = parts;
    const monthNum = parseInt(monthStr, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new Error("Invalid month in date.");
    }

    // Jalali and Gregorian month names.
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

    // Pick the correct month name from the appropriate array.
    const monthName =
      calendar === "gregorian"
        ? gregorianMonths[monthNum - 1]
        : jalaliMonths[monthNum - 1];

    // Convert day and year using convertNumber() for textual representation.
    const dayWords = this.convertNumber(dayStr);
    const yearWords = this.convertNumber(yearStr);

    // Return the final string, e.g. "هفدهم مرداد یک هزار و چهارصد و دو" (Jalali),
    // or "پنج آوریل دو هزار و بیست و سه" (Gregorian).
    return `${dayWords} ${monthName} ${yearWords}`;
  }

  /**
   * Converts a time string in "HH:mm" format to its Persian textual representation.
   * For instance, "09:05" => "ساعت نه و پنج دقیقه".
   *
   * @param {string} timeStr - The time string in "HH:mm" format.
   * @returns {string} The textual representation of the given time in Persian.
   * @throws {Error} If the format is invalid (not "HH:mm") or if hours/minutes are out of valid range.
   */
  public convertTimeToWords(timeStr: string): string {
    // Split the time string into hours and minutes.
    const parts = timeStr.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid time format. Expected format 'HH:mm'.");
    }

    // Parse numeric values for hour and minute.
    const [hourStr, minuteStr] = parts;
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Validate hours and minutes.
    if (isNaN(hour) || isNaN(minute)) {
      throw new Error(
        "Invalid time format. Hours and minutes should be numbers."
      );
    }
    if (hour < 0 || hour > 23) {
      throw new Error("Invalid hour value. Hour should be between 0 and 23.");
    }
    if (minute < 0 || minute > 59) {
      throw new Error(
        "Invalid minute value. Minute should be between 0 and 59."
      );
    }

    // In the original code, we used `this.config.customTimePrefix`,
    // but here we simply default to "ساعت" if no custom prefix is available.
    const timePrefix = (this as any).config?.customTimePrefix ?? "ساعت";

    // Convert hour and minute to words.
    const hourWords = this.convertNumber(hour);
    const minuteWords = this.convertNumber(minute);

    // If the minute is zero, return just the hour (e.g., "ساعت هجده").
    // Otherwise, add "و X دقیقه" after the hour.
    if (minute === 0) {
      return `${timePrefix} ${hourWords}`;
    } else {
      return `${timePrefix} ${hourWords} و ${minuteWords} دقیقه`;
    }
  }
}
