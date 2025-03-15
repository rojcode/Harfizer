/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the PersianLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Jalali/Gregorian),
 * and times ("HH:mm"). Various edge cases such as invalid formats,
 * out-of-range values, custom separators, and custom words are also tested.
 */

import { CoreConverter, ConversionOptions, InputNumber } from "../core";
import { PersianLanguagePlugin } from "../plugins/persianPlugin";

describe("CoreConverter with PersianLanguagePlugin", () => {
  let converter: CoreConverter;

  /**
   * Creates a fresh instance of CoreConverter with PersianLanguagePlugin
   * before each test to ensure test isolation.
   */
  beforeEach(() => {
    const persianPlugin = new PersianLanguagePlugin();
    converter = new CoreConverter(persianPlugin);
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    // Expect the decimal part to be properly handled and appended with "ممیز".
    const result = converter.convertNumber(12345.67);
    expect(result).toBe("دوازده هزار و سیصد و چهل و پنج ممیز شصت و هفت صدم");
  });

  test("Convert zero", () => {
    // Zero should return the word "صفر" by default.
    const result = converter.convertNumber(0);
    expect(result).toBe("صفر");
  });

  test("Convert negative number (-11)", () => {
    // A negative value should prefix the result with "منفی ".
    const result = converter.convertNumber(-11);
    expect(result).toBe("منفی یازده");
  });

  test("Use custom separator", () => {
    // The custom separator replaces the default " و " with "، ".
    const options: ConversionOptions = { customSeparator: "، " };
    const result = converter.convertNumber(12345, options);
    expect(result).toBe("دوازده هزار، سیصد و چهل و پنج");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    // Directly calls the triple conversion method for a 3-digit number.
    const result = converter.convertTripleToWords(456);
    expect(result).toBe("چهارصد و پنجاه و شش");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    // Tests triple conversion for another 3-digit number.
    const result = converter.convertTripleToWords(345);
    expect(result).toBe("سیصد و چهل و پنج");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    // The plugin should handle commas in string input (e.g. "1,234,567.89").
    const result = converter.convertNumber("1,234,567.89");
    expect(result).toBe(
      "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    // Ensures spaces are also removed properly when parsing numbers.
    const result = converter.convertNumber("1 234 567.89");
    expect(result).toBe(
      "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    // Dashes in the string should also be removed before conversion.
    const result = converter.convertNumber("1-2343-53123");
    expect(result).toBe(
      "یک میلیارد و دویست و سی و چهار میلیون و سیصد و پنجاه و سه هزار و یکصد و بیست و سه"
    );
  });

  test("Convert using BigInt input", () => {
    // Verifies that very large integers (BigInt) can be converted without error.
    const bigIntInput: InputNumber = BigInt("123456789123456789");
    expect(() => converter.convertNumber(bigIntInput)).not.toThrow();
    const result = converter.convertNumber(bigIntInput);
    expect(result.length).toBeGreaterThan(0);
  });

  test("Throw error for invalid input format", () => {
    // "abc123" is not a valid numeric format, expecting the method to throw.
    expect(() => converter.convertNumber("abc123")).toThrow(
      "Error: Invalid input format."
    );
  });

  test("Throw error for out-of-range input", () => {
    // A string with 67 digits exceeds the allowed length, expecting an out-of-range error.
    const outOfRangeInput = "1".repeat(67);
    expect(() => converter.convertNumber(outOfRangeInput)).toThrow(
      "Error: Out of range."
    );
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    // Custom words should replace the defaults for negative and zero terms.
    const customOptions: ConversionOptions = {
      customNegativeWord: "minus",
      customZeroWord: "zero",
      customSeparator: " - ",
    };
    const negativeResult = converter.convertNumber(-11, customOptions);
    expect(negativeResult).toBe("minus یازده");

    const zeroResult = converter.convertNumber(0, customOptions);
    expect(zeroResult).toBe("zero");
  });

  describe("Date conversion", () => {
    test("Convert Jalali date to words using slash format (1404/03/24)", () => {
      // The plugin should correctly parse and convert a Jalali date with slashes.
      const result = converter.convertDateToWords("1404/03/24");
      expect(result).toBe("بیست و چهار خرداد یک هزار و چهارصد و چهار");
    });

    test("Convert Jalali date to words using dash format (1404-03-24)", () => {
      // Same date but with dashes instead of slashes.
      const result = converter.convertDateToWords("1404-03-24");
      expect(result).toBe("بیست و چهار خرداد یک هزار و چهارصد و چهار");
    });

    test("Convert Gregorian date to words (2023-04-05)", () => {
      // A Gregorian date should use the correct month name from the plugin's lexicon.
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      expect(result).toBe("پنج آوریل دو هزار و بیست و سه");
    });
  });

  describe("convertTimeToWords", () => {
    test("should convert time '09:05' with default prefix", () => {
      // Checks a time conversion with minutes not equal to zero.
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("ساعت نه و پنج دقیقه");
    });

    test("should convert time '18:00' with default prefix", () => {
      // When minutes are zero, it should omit the 'و X دقیقه' part.
      const result = converter.convertTimeToWords("18:00");
      expect(result).toBe("ساعت هجده");
    });

    test("should convert time with custom time prefix (demo)", () => {
      // In the current plugin code, a custom time prefix might not be directly implemented,
      // but here we just demonstrate the default behavior.
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("ساعت نه و پنج دقیقه");
    });

    test("should throw error for invalid time format", () => {
      // "9-05" is not a valid "HH:mm" format.
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
