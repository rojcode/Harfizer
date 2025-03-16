/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the EnglishLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */

import { CoreConverter, ConversionOptions, InputNumber } from "../core";
import { EnglishLanguagePlugin } from "../plugins/englishPlugin";

describe("CoreConverter with EnglishLanguagePlugin", () => {
  let converter: CoreConverter;

  /**
   * Creates a fresh instance of CoreConverter with EnglishLanguagePlugin
   * before each test to ensure test isolation.
   */
  beforeEach(() => {
    const englishPlugin = new EnglishLanguagePlugin();
    converter = new CoreConverter(englishPlugin);
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    // Expected conversion:
    // Integer part "12345" splits into groups:
    //   "012" → 12 → "twelve" with scale "thousand" → "twelve thousand"
    //   "345" → "three hundred forty-five"
    // Joined: "twelve thousand three hundred forty-five"
    // Fractional part "67" → digits "six" and "seven" → "point six seven"
    // Final: "twelve thousand three hundred forty-five point six seven"
    const result = converter.convertNumber(12345.67);
    expect(result).toBe(
      "twelve thousand three hundred forty-five point six seven"
    );
  });

  test("Convert zero", () => {
    const result = converter.convertNumber(0);
    expect(result).toBe("zero");
  });

  test("Convert negative number (-11)", () => {
    // Expected: "minus eleven"
    const result = converter.convertNumber(-11);
    expect(result).toBe("minus eleven");
  });

  test("Use custom separator", () => {
    // For 12345, expected tokens: ["twelve thousand", "three hundred forty-five"]
    // Joined with " - " yields: "twelve thousand - three hundred forty-five"
    const options: ConversionOptions = { customSeparator: " - " };
    const result = converter.convertNumber(12345, options);
    expect(result).toBe("twelve thousand - three hundred forty-five");
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    const customOptions: ConversionOptions = {
      customNegativeWord: "minus_custom",
      customZeroWord: "zero_custom",
      customSeparator: " - ",
    };
    const negativeResult = converter.convertNumber(-11, customOptions);
    expect(negativeResult).toBe("minus_custom - eleven");

    const zeroResult = converter.convertNumber(0, customOptions);
    expect(zeroResult).toBe("zero_custom");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    // 456 → "four hundred fifty-six"
    const result = converter.convertTripleToWords(456);
    expect(result).toBe("four hundred fifty-six");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    // 345 → "three hundred forty-five"
    const result = converter.convertTripleToWords(345);
    expect(result).toBe("three hundred forty-five");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    // "1,234,567.89" becomes "1234567.89"
    // Groups: ["1", "234", "567"]
    // "1" → "one" with scale "million" → "one million"
    // "234" → "two hundred thirty-four" with scale "thousand" → "two hundred thirty-four thousand"
    // "567" → "five hundred sixty-seven"
    // Joined: "one million two hundred thirty-four thousand five hundred sixty-seven"
    // Fractional part "89": "eight" and "nine" → "point eight nine"
    // Final expected: "one million two hundred thirty-four thousand five hundred sixty-seven point eight nine"
    const result = converter.convertNumber("1,234,567.89");
    expect(result).toBe(
      "one million two hundred thirty-four thousand five hundred sixty-seven point eight nine"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    const result = converter.convertNumber("1 234 567.89");
    expect(result).toBe(
      "one million two hundred thirty-four thousand five hundred sixty-seven point eight nine"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    // "1-2343-53123" becomes "1234353123"
    // Expected grouping (after padding): ["1", "234", "353", "123"]
    // "1" → "one" with scale "billion" → "one billion"
    // "234" → "two hundred thirty-four" with scale "million" → "two hundred thirty-four million"
    // "353" → "three hundred fifty-three" with scale "thousand" → "three hundred fifty-three thousand"
    // "123" → "one hundred twenty-three"
    // Final expected: "one billion two hundred thirty-four million three hundred fifty-three thousand one hundred twenty-three"
    const result = converter.convertNumber("1-2343-53123");
    expect(result).toBe(
      "one billion two hundred thirty-four million three hundred fifty-three thousand one hundred twenty-three"
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
      // Expected: "April 5, two thousand twenty-three"
      // Note: Year is converted to words using convertNumber.
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      expect(result).toBe("April 5, two thousand twenty-three");
    });

    test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
      const result = converter.convertDateToWords("2023/04/05", "gregorian");
      expect(result).toBe("April 5, two thousand twenty-three");
    });
  });

  describe("convertTimeToWords", () => {
    test("should convert time '09:05' correctly", () => {
      // 9 → "nine", 5 → "five"; expected: "It is nine o'clock and five minutes"
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("It is nine o'clock and five minutes");
    });

    test("should convert time '18:00' correctly", () => {
      // 18 → "eighteen"; expected: "It is eighteen o'clock"
      const result = converter.convertTimeToWords("18:00");
      expect(result).toBe("It is eighteen o'clock");
    });

    test("should throw error for invalid time format", () => {
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
