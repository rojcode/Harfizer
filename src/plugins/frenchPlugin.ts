/**
 * @fileoverview
 * The FrenchLanguagePlugin class implements the LanguagePlugin interface
 * and provides methods for converting numbers, dates, and times into their
 * French textual representation. It handles integer and decimal numbers,
 * negative values, Gregorian date strings, and time strings (HH:mm).
 *
 * Note: The Persian solar calendar is specific to Persian. For French, the
 * Gregorian calendar is used with French month names.
 */

import { ConversionOptions, InputNumber, LanguagePlugin } from "../core";

export class FrenchLanguagePlugin implements LanguagePlugin {
  /**
   * Default separator for joining parts (space in French).
   */
  private static readonly DEFAULT_SEPARATOR: string = " ";

  /**
   * Word for zero in French.
   */
  private static readonly ZERO_WORD: string = "zéro";

  /**
   * Word used for negative numbers.
   */
  private static readonly NEGATIVE_WORD: string = "moins";

  /**
   * Large scale units in French for thousand grouping.
   * Extended to support up to 22 levels (e.g. décilliard).
   * Note: "mille" is used without "un" for 1000.
   */
  private static readonly SCALE: string[] = [
    "", // 10^0
    "mille", // 10^3
    "million", // 10^6
    "milliard", // 10^9
    "billion", // 10^12
    "billiard", // 10^15
    "trillion", // 10^18
    "trilliard", // 10^21
    "quadrillion", // 10^24
    "quadrilliard", // 10^27
    "quintillion", // 10^30
    "quintilliard", // 10^33
    "sextillion", // 10^36
    "sextilliard", // 10^39
    "septillion", // 10^42
    "septilliard", // 10^45
    "octillion", // 10^48
    "octilliard", // 10^51
    "nonillion", // 10^54
    "nonilliard", // 10^57
    "décillion", // 10^60
    "décilliard", // 10^63
  ];

  /**
   * **اضافه شده برای رفع خطای اینترفیس**
   * Converts a three-digit number (or fewer) into its French textual representation.
   * This method is required by the LanguagePlugin interface.
   *
   * @param {InputNumber} num - The three-digit number to convert.
   * @param {any} [lexicon] - This parameter is ignored in French conversion.
   * @param {string} [_separator] - This parameter is ignored in French conversion.
   * @returns {string} The textual representation of the three-digit number.
   */
  public convertTripleToWords(
    num: InputNumber,
    lexicon?: any,
    _separator?: string
  ): string {
    // تبدیل ورودی به عدد صحیح
    const value =
      typeof num === "bigint" ? Number(num) : parseInt(num.toString(), 10);
    if (value === 0) return "";
    return this.convertBelowThousand(value);
  }

  /**
   * Converts a number below 100 into its French textual representation.
   * Handles special cases such as 21, 31, etc. and the peculiarities of 70-79 and 80-99.
   *
   * @param {number} n - Number less than 100.
   * @returns {string} The French words for the given number.
   */
  private convertBelowHundred(n: number): string {
    const units = [
      "zéro",
      "un",
      "deux",
      "trois",
      "quatre",
      "cinq",
      "six",
      "sept",
      "huit",
      "neuf",
    ];
    const teens = [
      "dix",
      "onze",
      "douze",
      "treize",
      "quatorze",
      "quinze",
      "seize",
    ];
    if (n < 10) {
      return units[n];
    }
    if (n >= 10 && n < 17) {
      return teens[n - 10];
    }
    if (n < 20) {
      // 17, 18, 19: dix-sept, dix-huit, dix-neuf
      return "dix-" + units[n - 10];
    }
    // For numbers from 20 to 69.
    if (n < 70) {
      const tensArray = [
        "",
        "",
        "vingt",
        "trente",
        "quarante",
        "cinquante",
        "soixante",
      ];
      const tens = Math.floor(n / 10);
      const unit = n % 10;
      if (unit === 0) {
        return tensArray[tens];
      } else if (unit === 1) {
        // Exception: 21, 31, 41, 51, 61 -> "vingt et un", etc.
        return tensArray[tens] + " et un";
      } else {
        return tensArray[tens] + "-" + units[unit];
      }
    }
    // For numbers from 70 to 79: expressed as 60 + 10..19.
    if (n < 80) {
      const remainder = n - 60;
      if (remainder === 1) {
        return "soixante et onze"; // 71
      } else {
        return "soixante-" + this.convertBelowHundred(10 + remainder);
      }
    }
    // For numbers from 80 to 99.
    if (n < 100) {
      if (n === 80) {
        return "quatre-vingts";
      }
      const remainder = n - 80;
      // Note: For 81, 91 etc., no "et" is used.
      return "quatre-vingt-" + this.convertBelowHundred(remainder);
    }
    return "";
  }

  /**
   * Converts a number below 1000 into its French textual representation.
   * Handles the hundreds and the special plural rule for "cent".
   *
   * @param {number} n - Number less than 1000.
   * @returns {string} The French words for the given number.
   */
  private convertBelowThousand(n: number): string {
    let words = "";
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    if (hundreds > 0) {
      if (hundreds === 1) {
        words += "cent";
      } else {
        words += this.convertBelowHundred(hundreds) + " cent";
      }
      // Add plural "s" to "cent" if no remainder and hundreds > 1.
      if (remainder === 0 && hundreds > 1) {
        words += "s";
      }
    }
    if (remainder > 0) {
      if (words !== "") {
        words += " ";
      }
      words += this.convertBelowHundred(remainder);
    }
    return words;
  }

  /**
   * Splits a numeric string into groups of three digits.
   * Example: "1234567" => ["1", "234", "567"]
   *
   * @param {string | number} num - The number to be split.
   * @returns {string[]} An array of three-digit groups.
   */
  private static splitIntoTriples(num: number | string): string[] {
    let str: string = typeof num === "number" ? num.toString() : num;
    const triples: string[] = [];
    while (str.length > 0) {
      const end = str.length;
      const start = Math.max(0, end - 3);
      triples.unshift(str.substring(start, end));
      str = str.substring(0, start);
    }
    return triples;
  }

  /**
   * Converts a given number (integer or decimal, possibly negative) into its French textual form.
   * Handles custom options and converts the fractional part by reading each digit.
   *
   * @param {InputNumber} input - The number to be converted.
   * @param {ConversionOptions} [options] - Optional configuration.
   *        Supported options:
   *          - customZeroWord: override the default word for zero.
   *          - customNegativeWord: override the default negative word.
   *          - customSeparator: override the default separator between number groups.
   * @returns {string} The French word representation of the given number.
   * @throws {Error} If the input format is invalid or if the number is out of allowed range.
   */
  public convertNumber(
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    const effectiveOptions: ConversionOptions = { ...options };

    // استفاده از تنظیمات سفارشی در صورت وجود.
    const zeroWord =
      effectiveOptions.customZeroWord || FrenchLanguagePlugin.ZERO_WORD;
    const negativeWord =
      effectiveOptions.customNegativeWord || FrenchLanguagePlugin.NEGATIVE_WORD;
    const separator =
      effectiveOptions.customSeparator ||
      FrenchLanguagePlugin.DEFAULT_SEPARATOR;

    let rawInput: string =
      typeof input === "bigint" ? input.toString() : input.toString().trim();

    // Handle negative numbers and remove commas/spaces/dashes.
    let isNegative = false;
    if (rawInput.startsWith("-")) {
      isNegative = true;
      rawInput = rawInput.slice(1).replace(/[,\s-]/g, "");
    } else {
      rawInput = rawInput.replace(/[,\s-]/g, "");
    }

    if (!/^\d+(\.\d+)?$/.test(rawInput)) {
      throw new Error("Error: Invalid input format.");
    }

    // Check if the number is zero.
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

    // Limit integer part length.
    if (integerPart.length > 66) {
      throw new Error("Error: Out of range.");
    }

    // Split the integer part into triples.
    const triples = FrenchLanguagePlugin.splitIntoTriples(integerPart);
    const tokens: string[] = [];
    const scale = FrenchLanguagePlugin.SCALE;
    const numTriples = triples.length;

    // For each triple group, به صورت جداگانه عدد و واحد مقیاس را به آرایه توکن‌ها اضافه می‌کنیم.
    for (let i = 0; i < numTriples; i++) {
      const groupNum = parseInt(triples[i], 10);
      if (groupNum === 0) continue;
      const scaleIndex = numTriples - i - 1;
      const scaleWord = scale[scaleIndex];

      if (scaleIndex === 1 && groupNum === 1) {
        // برای 1000، اگر عدد 1 باشد، فقط "mille" را اضافه می‌کنیم.
        tokens.push(scaleWord);
      } else {
        // در غیر این صورت، ابتدا عبارت عددی را اضافه می‌کنیم.
        tokens.push(this.convertBelowThousand(groupNum));
        if (scaleIndex > 0) {
          // برای واحدهای بالاتر از 1، اگر مقیاس نیاز به جمع داشته باشد، اضافه می‌کنیم.
          let finalScale =
            scaleIndex >= 2
              ? groupNum > 1
                ? scaleWord + "s"
                : scaleWord
              : scaleWord;
          tokens.push(finalScale);
        }
      }
    }

    let result = tokens.join(separator);

    // Handle fractional part: decimals are read digit by digit after "virgule".
    if (fractionalPart.length > 0) {
      const digitNames = [
        "zéro",
        "un",
        "deux",
        "trois",
        "quatre",
        "cinq",
        "six",
        "sept",
        "huit",
        "neuf",
      ];
      const fracWords = fractionalPart
        .split("")
        .map((d) => digitNames[parseInt(d, 10)])
        .join(separator);
      result += separator + "virgule" + separator + fracWords;
    }

    if (isNegative) {
      result = negativeWord + separator + result;
    }
    return result;
  }

  /**
   * Converts a Gregorian date string (in "YYYY/MM/DD" or "YYYY-MM-DD" format)
   * into its French textual representation.
   * For day 1, "premier" is used; month names are in French.
   *
   * @param {string} dateStr - The date string to be converted.
   * @param {"jalali" | "gregorian"} [calendar="gregorian"] - Only Gregorian is supported for French.
   * @returns {string} The French textual form of the given date.
   * @throws {Error} If the format is invalid or month is out of range.
   */
  public convertDateToWords(
    dateStr: string,
    calendar: "jalali" | "gregorian" = "gregorian"
  ): string {
    // For French, only Gregorian calendar is used.
    const parts = dateStr.split(/[-\/]/);
    if (parts.length !== 3) {
      throw new Error(
        "Invalid date format. Expected 'YYYY/MM/DD' or 'YYYY-MM-DD'."
      );
    }
    const [yearStr, monthStr, dayStr] = parts;
    const monthNum = parseInt(monthStr, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new Error("Invalid month in date.");
    }
    const frenchMonths = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    const monthName = frenchMonths[monthNum - 1];

    // For day: use "premier" for 1, otherwise convert as number.
    const dayNum = parseInt(dayStr, 10);
    const dayWords = dayNum === 1 ? "premier" : this.convertNumber(dayNum);
    const yearWords = this.convertNumber(yearStr);

    return `${dayWords} ${monthName} ${yearWords}`;
  }

  /**
   * Converts a time string in "HH:mm" format to its French textual representation.
   * Example: "09:05" => "Il est neuf heures cinq minutes".
   *
   * @param {string} timeStr - The time string in "HH:mm" format.
   * @returns {string} The French textual representation of the time.
   * @throws {Error} If the format is invalid or hours/minutes are out of range.
   */
  public convertTimeToWords(timeStr: string): string {
    const parts = timeStr.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid time format. Expected format 'HH:mm'.");
    }
    const [hourStr, minuteStr] = parts;
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
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

    // Build the hour string.
    // In French, 1 o'clock is "une heure" (feminine).
    const hourWords = hour === 1 ? "une" : this.convertNumber(hour);
    let timeText = "Il est " + hourWords + " heure";
    if (hour !== 1) {
      timeText += "s";
    }

    // Append minutes if not zero.
    if (minute > 0) {
      const minuteWords = minute === 1 ? "une" : this.convertNumber(minute);
      timeText += " " + minuteWords + " minute" + (minute === 1 ? "" : "s");
    }
    return timeText;
  }
}
