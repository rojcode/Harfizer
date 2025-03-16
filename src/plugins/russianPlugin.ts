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

export class RussianLanguagePlugin implements LanguagePlugin {
  private static readonly DEFAULT_SEPARATOR: string = " ";
  private static readonly ZERO_WORD: string = "ноль";
  private static readonly NEGATIVE_WORD: string = "минус";
  private static readonly SCALE: string[] = [
    "",
    "тысяча",
    "миллион",
    "миллиард",
    "триллион",
    "квадриллион",
  ];

  private static readonly DIGITS: string[] = [
    "",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
  ];
  private static readonly TEENS: string[] = [
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать",
  ];
  private static readonly TENS: string[] = [
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
  ];
  private static readonly HUNDREDS: string[] = [
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
  ];

  public convertTripleToWords(
    num: InputNumber,
    lexicon?: any,
    _separator?: string
  ): string {
    const value =
      typeof num === "bigint" ? Number(num) : parseInt(num.toString(), 10);
    if (value === 0) return "";
    return this.convertBelowThousand(value);
  }

  private convertBelowThousand(n: number): string {
    let result = "";
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    if (hundreds > 0) {
      result += RussianLanguagePlugin.HUNDREDS[hundreds];
    }
    if (remainder > 0) {
      if (remainder < 10) {
        result += (result ? " " : "") + RussianLanguagePlugin.DIGITS[remainder];
      } else if (remainder < 20) {
        result +=
          (result ? " " : "") + RussianLanguagePlugin.TEENS[remainder - 10];
      } else {
        const tens = Math.floor(remainder / 10);
        const unit = remainder % 10;
        result += (result ? " " : "") + RussianLanguagePlugin.TENS[tens];
        if (unit > 0) {
          result += " " + RussianLanguagePlugin.DIGITS[unit];
        }
      }
    }
    return result;
  }

  private static splitIntoTriples(num: number | string): string[] {
    let str: string = typeof num === "number" ? num.toString() : num;
    const groups: string[] = [];
    while (str.length > 0) {
      const end = str.length;
      const start = Math.max(0, end - 3);
      groups.unshift(str.substring(start, end));
      str = str.substring(0, start);
    }
    return groups;
  }

  // New helper: convertYear to process 4-digit years with correct feminine forms.
  private convertYear(year: number): string {
    if (year < 1000) {
      return this.convertNumber(year);
    }
    const thousands = Math.floor(year / 1000);
    const remainder = year % 1000;
    let thousandsPart = "";
    if (thousands === 1) {
      thousandsPart = "одна тысяча";
    } else if (thousands === 2) {
      thousandsPart = "две тысячи";
    } else {
      // For numbers 3 and above, determine proper form.
      const form =
        [2, 3, 4].includes(thousands % 10) &&
        ![12, 13, 14].includes(thousands % 100)
          ? "тысячи"
          : "тысяч";
      thousandsPart = this.convertNumber(thousands) + " " + form;
    }
    let remainderPart =
      remainder > 0 ? " " + this.convertNumber(remainder) : "";
    return thousandsPart + remainderPart;
  }

  public convertNumber(
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    const effectiveOptions: ConversionOptions = { ...options };

    const zeroWord =
      effectiveOptions.customZeroWord || RussianLanguagePlugin.ZERO_WORD;
    const negativeWord =
      effectiveOptions.customNegativeWord ||
      RussianLanguagePlugin.NEGATIVE_WORD;
    const separator =
      effectiveOptions.customSeparator ||
      RussianLanguagePlugin.DEFAULT_SEPARATOR;

    let rawInput: string =
      typeof input === "bigint" ? input.toString() : input.toString().trim();

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

    // Break integer part into triples.
    const triples: string[] =
      RussianLanguagePlugin.splitIntoTriples(integerPart);
    const wordParts: string[] = [];

    for (let i = 0; i < triples.length; i++) {
      const converted = this.convertTripleToWords(triples[i]);
      if (converted !== "") {
        const scaleIndex = triples.length - i - 1;
        let scaleWord = "";
        if (scaleIndex > 0) {
          scaleWord = RussianLanguagePlugin.SCALE[scaleIndex];
        }
        wordParts.push(converted + (scaleWord ? " " + scaleWord : ""));
      }
    }

    let result = wordParts.join(separator);

    // Process fractional part using " запятая ".
    if (fractionalPart.length > 0) {
      const digitNames = [
        "ноль",
        "один",
        "два",
        "три",
        "четыре",
        "пять",
        "шесть",
        "семь",
        "восемь",
        "девять",
      ];
      const fracTokens = fractionalPart
        .split("")
        .map((d) => digitNames[parseInt(d, 10)]);
      result += separator + "запятая" + separator + fracTokens.join(separator);
    }

    if (isNegative) {
      result = negativeWord + separator + result;
    }
    return result;
  }

  public convertDateToWords(
    dateStr: string,
    calendar: "jalali" | "gregorian" = "gregorian"
  ): string {
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
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const monthName = months[monthNum - 1];
    const dayWords = this.convertNumber(dayStr);
    // Instead of using convertNumber for year, use convertYear for correct forms.
    const yearWords = this.convertYear(parseInt(yearStr, 10));
    return `${dayWords} ${monthName} ${yearWords} года`;
  }

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

    const hourWords = this.convertNumber(hour);
    const minuteWords = this.convertNumber(minute);
    const hourSuffix = this.getHourSuffix(hour);
    const minuteSuffix = this.getMinuteSuffix(minute);
    if (minute === 0) {
      return `${hourWords} ${hourSuffix}`;
    } else {
      return `${hourWords} ${hourSuffix} ${minuteWords} ${minuteSuffix}`;
    }
  }

  private getHourSuffix(hour: number): string {
    if (hour % 10 === 1 && hour % 100 !== 11) {
      return "час";
    } else if (
      [2, 3, 4].includes(hour % 10) &&
      ![12, 13, 14].includes(hour % 100)
    ) {
      return "часа";
    } else {
      return "часов";
    }
  }

  private getMinuteSuffix(minute: number): string {
    if (minute % 10 === 1 && minute % 100 !== 11) {
      return "минута";
    } else if (
      [2, 3, 4].includes(minute % 10) &&
      ![12, 13, 14].includes(minute % 100)
    ) {
      return "минуты";
    } else {
      return "минут";
    }
  }
}
