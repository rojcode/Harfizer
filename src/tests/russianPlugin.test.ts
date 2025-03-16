/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the RussianLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */

import { CoreConverter, ConversionOptions, InputNumber } from "../core";
import { RussianLanguagePlugin } from "../plugins/russianPlugin";

describe("CoreConverter with RussianLanguagePlugin", () => {
  let converter: CoreConverter;

  /**
   * Creates a fresh instance of CoreConverter with RussianLanguagePlugin
   * before each test to ensure test isolation.
   */
  beforeEach(() => {
    const russianPlugin = new RussianLanguagePlugin();
    converter = new CoreConverter(russianPlugin);
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    // Explanation:
    // "12345" (after padding becomes "012345") splits into ["012", "345"]:
    // "012" → 12 → "двенадцать" with scale[1]="тысяча" → "двенадцать тысяча"
    // "345" → "триста сорок пять"
    // Joined: "двенадцать тысяча триста сорок пять"
    // Fractional part "67" → "шесть" and "семь", joined as "запятая шесть семь"
    // Final expected result: "двенадцать тысяча триста сорок пять запятая шесть семь"
    const result = converter.convertNumber(12345.67);
    expect(result).toBe(
      "двенадцать тысяча триста сорок пять запятая шесть семь"
    );
  });

  test("Convert zero", () => {
    // Zero should return "ноль".
    const result = converter.convertNumber(0);
    expect(result).toBe("ноль");
  });

  test("Convert negative number (-11)", () => {
    // Expected: "минус одиннадцать"
    const result = converter.convertNumber(-11);
    expect(result).toBe("минус одиннадцать");
  });

  test("Use custom separator", () => {
    // For 12345, expected tokens: ["двенадцать тысяча", "триста сорок пять"]
    // Joined with " - " yields: "двенадцать тысяча - триста сорок пять"
    const options: ConversionOptions = { customSeparator: " - " };
    const result = converter.convertNumber(12345, options);
    expect(result).toBe("двенадцать тысяча - триста сорок пять");
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    const customOptions: ConversionOptions = {
      customNegativeWord: "минус_custom",
      customZeroWord: "ноль_custom",
      customSeparator: " - ",
    };
    const negativeResult = converter.convertNumber(-11, customOptions);
    expect(negativeResult).toBe("минус_custom - одиннадцать");

    const zeroResult = converter.convertNumber(0, customOptions);
    expect(zeroResult).toBe("ноль_custom");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    // 456 → "четыреста пятьдесят шесть"
    const result = converter.convertTripleToWords(456);
    expect(result).toBe("четыреста пятьдесят шесть");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    // 345 → "триста сорок пять"
    const result = converter.convertTripleToWords(345);
    expect(result).toBe("триста сорок пять");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    // "1,234,567.89" → "1234567.89"
    // Groups: ["1", "234", "567"]
    // "1" → "один" with scale[2] ("миллион") → "один миллион"
    // "234" → "двести тридцать четыре" with scale[1] ("тысяча") → "двести тридцать четыре тысяча"
    // "567" → "пятьсот шестьдесят семь"
    // Fractional part "89" → "восемь" and "девять" → "запятая восемь девять"
    // Final expected: "один миллион двести тридцать четыре тысяча пятьсот шестьдесят семь запятая восемь девять"
    const result = converter.convertNumber("1,234,567.89");
    expect(result).toBe(
      "один миллион двести тридцать четыре тысяча пятьсот шестьдесят семь запятая восемь девять"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    const result = converter.convertNumber("1 234 567.89");
    expect(result).toBe(
      "один миллион двести тридцать четыре тысяча пятьсот шестьдесят семь запятая восемь девять"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    // "1-2343-53123" → "1234353123"
    // Groups: ["1", "234", "353", "123"]
    // "1" → "один" with scale[3] ("миллиард") → "один миллиард"
    // "234" → "двести тридцать четыре" with scale[2] ("миллион") → "двести тридцать четыре миллион"
    // "353" → "триста пятьдесят три" with scale[1] ("тысяча") → "триста пятьдесят три тысяча"
    // "123" → "сто двадцать три"
    // Final expected: "один миллиард двести тридцать четыре миллион триста пятьдесят три тысяча сто двадцать три"
    const result = converter.convertNumber("1-2343-53123");
    expect(result).toBe(
      "один миллиард двести тридцать четыре миллион триста пятьдесят три тысяча сто двадцать три"
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
      // For date "2023-04-05":
      // Day "5" → "пять"
      // Month 4 → "апреля" (genitive)
      // Year 2023 → convertYear returns "две тысячи двадцать три"
      // Expected: "пять апреля две тысячи двадцать три года"
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      expect(result).toBe("пять апреля две тысячи двадцать три года");
    });

    test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
      const result = converter.convertDateToWords("2023/04/05", "gregorian");
      expect(result).toBe("пять апреля две тысячи двадцать три года");
    });
  });

  describe("convertTimeToWords", () => {
    test("should convert time '09:05' correctly", () => {
      // 9 → "девять", 5 → "пять"; expected: "девять часов пять минут"
      const result = converter.convertTimeToWords("09:05");
      expect(result).toBe("девять часов пять минут");
    });

    test("should convert time '18:00' correctly", () => {
      // 18 → "восемнадцать"; expected: "восемнадцать часов"
      const result = converter.convertTimeToWords("18:00");
      expect(result).toBe("восемнадцать часов");
    });

    test("should throw error for invalid time format", () => {
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
