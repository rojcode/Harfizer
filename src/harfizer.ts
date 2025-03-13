/**
 * Type alias for input numbers. The input can be a number, string, or bigint.
 */
export type InputNumber = number | string | bigint;

/**
 * Type alias for a lexicon, which is represented as an array of string arrays.
 */
export type Lexicon = string[][];

/**
 * Options for customizing the conversion process.
 *
 * @property {boolean} [useNegativeWord] - Flag to indicate whether to use a negative word.
 * @property {string} [customSeparator] - Custom separator string to join groups in the final output.
 * @property {Lexicon} [customLexicon] - Custom lexicon used for number-to-word conversion.
 * @property {string[]} [customDecimalSuffixes] - Custom array of suffixes for the fractional part.
 * @property {string} [customNegativeWord] - Custom word to denote negative numbers.
 * @property {string} [customZeroWord] - Custom word to represent zero.
 */
export interface ConversionOptions {
  useNegativeWord?: boolean;
  customSeparator?: string;
  customLexicon?: Lexicon;
  customDecimalSuffixes?: string[];
  customNegativeWord?: string;
  customZeroWord?: string;
}

/**
 * Interface defining the conversion methods.
 */
export interface IConverter {
  /**
   * Converts an input number to its word representation.
   *
   * @param {InputNumber} input - The number to convert.
   * @param {ConversionOptions} [options] - Optional conversion options to override defaults.
   * @returns {string} The word representation of the number.
   */
  convert(input: InputNumber, options?: ConversionOptions): string;

  /**
   * Converts a triple-digit group into its word representation.
   *
   * @param {InputNumber} num - The triple-digit number to convert.
   * @param {Lexicon} [lexicon] - Optional custom lexicon for conversion.
   * @param {string} [separator] - Optional custom separator (ignored, internal separator is fixed).
   * @returns {string} The word representation of the triple-digit group.
   */
  convertTripleToWords(
    num: InputNumber,
    lexicon?: Lexicon,
    separator?: string
  ): string;
}

/**
 * HarfizerConverter class converts numbers to their Persian word representation.
 * It supports dynamic configuration and provides a static shortcut method for quick usage.
 */
export class HarfizerConverter implements IConverter {
  // Global configuration for dynamic settings.
  private config: ConversionOptions;

  // Default constants.
  private static readonly DEFAULT_SEPARATOR: string = " و ";
  private static readonly ZERO_WORD: string = "صفر";
  private static readonly NEGATIVE_WORD: string = "منفی ";

  // Default lexicon for number conversion.
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

  // Default decimal suffixes for the fractional part.
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
   * Constructor with dynamic configuration.
   *
   * @param {ConversionOptions} [config] - Global configuration options.
   */
  constructor(config?: ConversionOptions) {
    this.config = config ?? {};
  }

  /**
   * Splits the input number (as a string) into groups of three digits.
   *
   * @param {number | string} num - The number to split.
   * @returns {string[]} An array of triple-digit groups.
   */
  private static splitIntoTriples(num: number | string): string[] {
    let str: string = typeof num === "number" ? num.toString() : num;
    const mod = str.length % 3;
    if (mod === 1) {
      str = `00${str}`;
    } else if (mod === 2) {
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
  public convertTripleToWords(
    num: InputNumber,
    lexicon?: Lexicon,
    _separator?: string
  ): string {
    const localLexicon = lexicon ?? HarfizerConverter.DEFAULT_LEXICON;
    const internalSeparator = HarfizerConverter.DEFAULT_SEPARATOR;
    const numStr: string =
      typeof num === "bigint" ? num.toString() : num.toString();
    const value: number = parseInt(numStr, 10);
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
      const unit: number = value % 10;
      const tens: number = Math.floor(value / 10);
      if (unit > 0) {
        return (
          localLexicon[2][tens] + internalSeparator + localLexicon[0][unit]
        );
      }
      return localLexicon[2][tens];
    }
    const unit: number = value % 10;
    const hundreds: number = Math.floor(value / 100);
    const tens: number = Math.floor((value % 100) / 10);
    const parts: string[] = [localLexicon[3][hundreds]];
    const remainder: number = tens * 10 + unit;
    if (remainder === 0) {
      return parts.join(internalSeparator);
    }
    if (remainder < 10) {
      parts.push(localLexicon[0][remainder]);
    } else if (remainder <= 20) {
      parts.push(localLexicon[1][remainder - 10]);
    } else {
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
  private convertFractionalPart(
    fraction: string,
    decimalSuffixes?: string[]
  ): string {
    const localDecimalSuffixes =
      decimalSuffixes ?? HarfizerConverter.DEFAULT_DECIMAL_SUFFIXES;
    fraction = fraction.replace(/0*$/, "");
    if (fraction === "") {
      return "";
    }
    if (fraction.length > 11) {
      fraction = fraction.substr(0, 11);
    }
    return (
      " ممیز " +
      this.convert(fraction, { customDecimalSuffixes: localDecimalSuffixes }) +
      " " +
      localDecimalSuffixes[fraction.length]
    );
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
  public convert(input: InputNumber, options?: ConversionOptions): string {
    // Merge dynamic configuration with method-specific options.
    const effectiveOptions: ConversionOptions = { ...this.config, ...options };

    // Convert input to string.
    let rawInput: string =
      typeof input === "bigint" ? input.toString() : input.toString().trim();

    // Check for negative sign and remove it while preserving it.
    let isNeg: boolean = false;
    if (rawInput.startsWith("-")) {
      isNeg = true;
      rawInput = "-" + rawInput.slice(1).replace(/[,\s-]/g, "");
    } else {
      rawInput = rawInput.replace(/[,\s-]/g, "");
    }

    // Validate input: ensure it contains only digits (with optional negative sign) and a dot.
    if (!/^-?\d+(\.\d+)?$/.test(rawInput)) {
      throw new Error("Error: Invalid input format.");
    }

    const separator =
      effectiveOptions.customSeparator ?? HarfizerConverter.DEFAULT_SEPARATOR;
    const lexicon =
      effectiveOptions.customLexicon ?? HarfizerConverter.DEFAULT_LEXICON;
    const decimalSuffixes =
      effectiveOptions.customDecimalSuffixes ??
      HarfizerConverter.DEFAULT_DECIMAL_SUFFIXES;
    const zeroWord =
      effectiveOptions.customZeroWord ?? HarfizerConverter.ZERO_WORD;
    const negativeWord =
      effectiveOptions.customNegativeWord ?? HarfizerConverter.NEGATIVE_WORD;

    // Determine if the number is negative and remove the negative sign.
    let isNegative: boolean = isNeg;
    if (rawInput.startsWith("-")) {
      isNegative = true;
      rawInput = rawInput.substring(1);
    }

    // Determine if the number is a decimal or a big integer.
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
    if (
      (typeof numericValue === "number" && numericValue === 0) ||
      (typeof numericValue === "bigint" && numericValue === 0n)
    ) {
      return zeroWord;
    }

    // Split input into integer and fractional parts.
    let inputStr: string = rawInput;
    let fractionPart: string = "";
    const pointIndex: number = inputStr.indexOf(".");
    if (pointIndex > -1) {
      fractionPart = inputStr.substring(pointIndex + 1);
      inputStr = inputStr.substring(0, pointIndex);
    }
    if (inputStr.length > 66) {
      throw new Error("Error: Out of range.");
    }
    const triples: string[] = HarfizerConverter.splitIntoTriples(inputStr);
    const wordParts: string[] = [];
    for (let i = 0; i < triples.length; i++) {
      const converted: string = this.convertTripleToWords(
        triples[i],
        lexicon,
        undefined // Use the fixed internal separator
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
    const negPrefix =
      isNegative && !negativeWord.endsWith(" ")
        ? negativeWord + " "
        : negativeWord;
    return (
      (isNegative ? negPrefix : "") + wordParts.join(separator) + fractionPart
    );
  }

  /**
   * Returns the default separator from the configuration or default constant.
   *
   * @param {ConversionOptions} [options] - Optional conversion options.
   * @returns {string} The separator string.
   */
  private getSeparator(options?: ConversionOptions): string {
    return options?.customSeparator ?? HarfizerConverter.DEFAULT_SEPARATOR;
  }

  /**
   * Static helper method for quick conversion.
   *
   * @param {InputNumber} input - The number to convert.
   * @param {ConversionOptions} [options] - Optional conversion options.
   * @returns {string} The word representation of the number.
   */
  public static toWords(
    input: InputNumber,
    options?: ConversionOptions
  ): string {
    return new HarfizerConverter(options).convert(input);
  }
}
