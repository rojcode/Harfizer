/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the GermanLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */

import { CoreConverter, ConversionOptions, InputNumber } from "../core";
import { GermanLanguagePlugin } from "../plugins/germanPlugin";

describe("CoreConverter with GermanLanguagePlugin", () => {
  let converter: CoreConverter;

  /**
   * Creates a fresh instance of CoreConverter with GermanLanguagePlugin
   * before each test to ensure test isolation.
   */
  beforeEach(() => {
    const germanPlugin = new GermanLanguagePlugin();
    converter = new CoreConverter(germanPlugin);
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    // Explanation:
    // "12345" is padded to "012345" and split into ["012", "345"]:
    // "012" → 12 → "zwölf" (from TEENS) with scale "tausend" → "zwölf tausend"
    // "345" → 345 → "dreihundertfünfundvierzig" (compound, no space between "dreihundert" and "fünfundvierzig")
    // Joined: "zwölf tausend dreihundertfünfundvierzig"
    // Fractional part "67" is processed digit-by-digit:
    // "6" → "sechs", "7" → "sieben"
    // Final expected result:
    // "zwölf tausend dreihundertfünfundvierzig Komma sechs sieben"
    const result = converter.convertNumber(12345.67);
    expect(result).toBe(
      "zwölf tausend dreihundertfünfundvierzig Komma sechs sieben"
    );
  });

  test("Convert zero", () => {
    const result = converter.convertNumber(0);
    expect(result).toBe("null");
  });

  test("Convert negative number (-11)", () => {
    // Expected: "minus elf"
    const result = converter.convertNumber(-11);
    expect(result).toBe("minus elf");
  });

  test("Use custom separator", () => {
    // For 12345, expected tokens: ["zwölf tausend", "dreihundertfünfundvierzig"]
    // Joined with " - " yields: "zwölf tausend - dreihundertfünfundvierzig"
    const options: ConversionOptions = { customSeparator: " - " };
    const result = converter.convertNumber(12345, options);
    expect(result).toBe("zwölf tausend - dreihundertfünfundvierzig");
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    const customOptions: ConversionOptions = {
      customNegativeWord: "minus_custom",
      customZeroWord: "null_custom",
      customSeparator: " - ",
    };
    const negativeResult = converter.convertNumber(-11, customOptions);
    expect(negativeResult).toBe("minus_custom - elf");

    const zeroResult = converter.convertNumber(0, customOptions);
    expect(zeroResult).toBe("null_custom");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    // 456 → Expected: "vierhundertsechsundfünfzig"
    const result = converter.convertTripleToWords(456);
    expect(result).toBe("vierhundertsechsundfünfzig");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    // 345 → Expected: "dreihundertfünfundvierzig"
    const result = converter.convertTripleToWords(345);
    expect(result).toBe("dreihundertfünfundvierzig");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    // "1,234,567.89" becomes "1234567.89"
    // Groups: ["1", "234", "567"]
    // "1" → "eins" with scale "Million" → "eins Million"
    // "234" → "zweihundertvierunddreißig" with scale "tausend" → "zweihundertvierunddreißig tausend"
    // "567" → "fünfhundertsiebenundsechzig"
    // Fractional part "89" → "acht" and "neun" → "Komma acht neun"
    // Final expected:
    // "eins Million zweihundertvierunddreißig tausend fünfhundertsiebenundsechzig Komma acht neun"
    const result = converter.convertNumber("1,234,567.89");
    expect(result).toBe(
      "eins Million zweihundertvierunddreißig tausend fünfhundertsiebenundsechzig Komma acht neun"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    const result = converter.convertNumber("1 234 567.89");
    expect(result).toBe(
      "eins Million zweihundertvierunddreißig tausend fünfhundertsiebenundsechzig Komma acht neun"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    // "1-2343-53123" becomes "1234353123"
    // Expected groups: ["1", "234", "353", "123"]
    // "1" → "eins" with scale "Milliarde" → "eins Milliarde"
    // "234" → "zweihundertvierunddreißig" with scale "Million" → "zweihundertvierunddreißig Million"
    // "353" → "dreihundertdreiundfünfzig" with scale "tausend" → "dreihundertdreiundfünfzig tausend"
    // "123" → "einhundertdreiundzwanzig"
    const result = converter.convertNumber("1-2343-53123");
    expect(result).toBe(
      "eins Milliarde zweihundertvierunddreißig Million dreihundertdreiundfünfzig tausend einhundertdreiundzwanzig"
    );
  });

  test("Convert using BigInt input", () => {
    const bigIntInput: InputNumber = BigInt("123456789123456789");
    expect(() => converter.convertNumber(bigIntInput)).not.toThrow();
    const result = converter.convertNumber(bigIntInput);
    expect(result.length).toBeGreaterThan(0);
  });

  test("Throw error for invalid input format", () => {
    expect(() => converter.convertNumber("abc123")).toThrow(
      "Error: Invalid input format."
    );
  });

  test("Throw error for out-of-range input", () => {
    const outOfRangeInput = "1".repeat(67);
    expect(() => converter.convertNumber(outOfRangeInput)).toThrow(
      "Error: Out of range."
    );
  });

  describe("Date conversion", () => {
    test("Convert Gregorian date to words (2023-04-05)", () => {
      // Expected: "April 5, zwei tausend dreiundzwanzig"
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      expect(result).toBe("April 5, zwei tausend dreiundzwanzig");
    });

    test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
      const result = converter.convertDateToWords("2023/04/05", "gregorian");
      expect(result).toBe("April 5, zwei tausend dreiundzwanzig");
    });
  });

  describe("convertTimeToWords", () => {
    test("should convert time '09:05' correctly", () => {
      // Expected: "Es ist neun Uhr und fünf Minuten"
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("Es ist neun Uhr und fünf Minuten");
    });

    test("should convert time '18:00' correctly", () => {
      // Expected: "Es ist achtzehn Uhr"
      const result = converter.convertTimeToWords("18:00");
      expect(result).toBe("Es ist achtzehn Uhr");
    });

    test("should throw error for invalid time format", () => {
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
