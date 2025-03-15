/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the FrenchLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * and custom configurations are also tested.
 */

import { CoreConverter, ConversionOptions, InputNumber } from "../core";
import { FrenchLanguagePlugin } from "../plugins/frenchPlugin";

describe("CoreConverter with FrenchLanguagePlugin", () => {
  let converter: CoreConverter;

  /**
   * Creates a fresh instance of CoreConverter with FrenchLanguagePlugin
   * before each test to ensure test isolation.
   */
  beforeEach(() => {
    const frenchPlugin = new FrenchLanguagePlugin();
    converter = new CoreConverter(frenchPlugin);
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    // Expected conversion:
    // 12345 => "douze mille trois cent quarante-cinq"
    // Decimal part 67 => "virgule six sept"
    const result = converter.convertNumber(12345.67);
    expect(result).toBe(
      "douze mille trois cent quarante-cinq virgule six sept"
    );
  });

  test("Convert zero", () => {
    const result = converter.convertNumber(0);
    expect(result).toBe("zéro");
  });

  test("Convert negative number (-11)", () => {
    // For negative numbers, "moins" should prefix the conversion.
    const result = converter.convertNumber(-11);
    expect(result).toBe("moins onze");
  });

  test("Use custom separator", () => {
    // When a custom separator is provided, it should be used between all tokens.
    const options: ConversionOptions = { customSeparator: " - " };
    const result = converter.convertNumber(12345, options);
    // Expected tokens: ["douze", "mille", "trois cent quarante-cinq"]
    expect(result).toBe("douze - mille - trois cent quarante-cinq");
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    // Test custom words for negative and zero.
    const customOptions: ConversionOptions = {
      customNegativeWord: "moins_custom",
      customZeroWord: "zéro_custom",
      customSeparator: " - ",
    };

    const negativeResult = converter.convertNumber(-11, customOptions);
    expect(negativeResult).toBe("moins_custom - onze");

    const zeroResult = converter.convertNumber(0, customOptions);
    expect(zeroResult).toBe("zéro_custom");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    // Directly testing conversion of a three-digit number.
    const result = converter.convertTripleToWords(456);
    expect(result).toBe("quatre cent cinquante-six");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    const result = converter.convertTripleToWords(345);
    expect(result).toBe("trois cent quarante-cinq");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    // Pass customSeparator so that the output tokens are joined with " - "
    const result = converter.convertNumber("1,234,567.89", {
      customSeparator: " - ",
    });
    expect(result).toBe(
      "un - million - deux cent trente-quatre - mille - cinq cent soixante-sept - virgule - huit - neuf"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    const result = converter.convertNumber("1 234 567.89", {
      customSeparator: " - ",
    });
    expect(result).toBe(
      "un - million - deux cent trente-quatre - mille - cinq cent soixante-sept - virgule - huit - neuf"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    const result = converter.convertNumber("1-2343-53123", {
      customSeparator: " - ",
    });
    expect(result).toBe(
      "un - milliard - deux cent trente-quatre - millions - trois cent cinquante-trois - mille - cent vingt-trois"
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
    // A string with 67 digits should exceed the allowed length.
    const outOfRangeInput = "1".repeat(67);
    expect(() => converter.convertNumber(outOfRangeInput)).toThrow(
      "Error: Out of range."
    );
  });

  describe("Date conversion", () => {
    test("Convert Gregorian date to words (2023-04-05)", () => {
      // For Gregorian dates, the French month names are used.
      // Day 5 is converted as "cinq" and the year as "deux mille vingt-trois".
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      expect(result).toBe("cinq avril deux mille vingt-trois");
    });

    test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
      const result = converter.convertDateToWords("2023/04/05", "gregorian");
      expect(result).toBe("cinq avril deux mille vingt-trois");
    });
  });

  describe("convertTimeToWords", () => {
    test("should convert time '09:05' with default prefix", () => {
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("Il est neuf heures cinq minutes");
    });

    test("should convert time '18:00' with default prefix", () => {
      // When minutes are zero, only the hour is shown.
      const result = converter.convertTimeToWords("18:00");
      expect(result).toBe("Il est dix-huit heures");
    });

    test("should throw error for invalid time format", () => {
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
