import { HarfizerConverter, ConversionOptions, InputNumber } from "./harfizer";

describe("HarfizerConverter", () => {
  let converter: HarfizerConverter;

  beforeEach(() => {
    converter = new HarfizerConverter();
  });

  test("Convert positive number with decimal part (12345.67)", () => {
    const result = converter.convert(12345.67);
    // Expected conversion based on default lexicon:
    // "12345" -> "دوازده هزار و سیصد و چهل و پنج"
    // ".67" -> "ممیز شصت و هفت صدم"
    // Final output:
    expect(result).toBe("دوازده هزار و سیصد و چهل و پنج ممیز شصت و هفت صدم");
  });

  test("Convert zero", () => {
    const result = converter.convert(0);
    expect(result).toBe("صفر");
  });

  test("Convert negative number (-11)", () => {
    const result = converter.convert(-11);
    // -11 should convert to "منفی یازده"
    expect(result).toBe("منفی یازده");
  });

  test("Use custom separator", () => {
    const options: ConversionOptions = { customSeparator: "، " };
    const result = converter.convert(12345, options);
    // Expected output with custom separator instead of default " و "
    expect(result).toBe("دوازده هزار، سیصد و چهل و پنج");
  });

  test("Convert triple number with convertTripleToWords (456)", () => {
    const result = converter.convertTripleToWords(456);
    // 456 -> "چهارصد و پنجاه و شش"
    expect(result).toBe("چهارصد و پنجاه و شش");
  });

  test("Convert triple number with convertTripleToWords (345)", () => {
    const result = converter.convertTripleToWords(345);
    // 345 -> "سیصد و چهل و پنج"
    expect(result).toBe("سیصد و چهل و پنج");
  });

  test('Process input with comma separators ("1,234,567.89")', () => {
    const result = converter.convert("1,234,567.89");
    // After removing separators: "1234567.89"
    // Expected: "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم"
    expect(result).toBe(
      "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم"
    );
  });

  test('Process input with space separators ("1 234 567.89")', () => {
    const result = converter.convert("1 234 567.89");
    // Expected to be the same as above after removal of spaces
    expect(result).toBe(
      "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم"
    );
  });

  test('Process input with dash separators ("1-2343-53123")', () => {
    const result = converter.convert("1-2343-53123");
    // After removing dashes: "1234353123"
    // It becomes an 10-digit number; after padding: "001234353123"
    // Expected conversion (manually computed):
    // Triple groups: ["001", "234", "353", "123"]
    // "001" -> "یک" + lexicon[4][3] (" میلیارد")
    // "234" -> "دویست و سی و چهار" + lexicon[4][2] (" میلیون")
    // "353" -> "سیصد و پنجاه و سه" + lexicon[4][1] (" هزار")
    // "123" -> "یکصد و بیست و سه" + lexicon[4][0] ("")
    // Final output:
    expect(result).toBe(
      "یک میلیارد و دویست و سی و چهار میلیون و سیصد و پنجاه و سه هزار و یکصد و بیست و سه"
    );
  });

  test("Convert using BigInt input", () => {
    const bigIntInput: InputNumber = BigInt("123456789123456789");
    // Just assert that the conversion does not throw and returns a non-empty string.
    expect(() => converter.convert(bigIntInput)).not.toThrow();
    const result = converter.convert(bigIntInput);
    expect(result.length).toBeGreaterThan(0);
  });

  test("Throw error for invalid input format", () => {
    expect(() => converter.convert("abc123")).toThrow(
      "Error: Invalid input format."
    );
  });

  test("Throw error for out-of-range input", () => {
    // Create a number string with 67 digits.
    const outOfRangeInput = "1".repeat(67);
    expect(() => converter.convert(outOfRangeInput)).toThrow(
      "Error: Out of range."
    );
  });

  test("Dynamic configuration: custom negative and zero words", () => {
    const customOptions: ConversionOptions = {
      customNegativeWord: "minus",
      customZeroWord: "zero",
      customSeparator: " - ",
    };
    const customConverter = new HarfizerConverter(customOptions);
    const negativeResult = customConverter.convert(-11);
    // Expect custom negative word "minus" instead of default "منفی"
    expect(negativeResult).toBe("minus یازده");
    const zeroResult = customConverter.convert(0);
    // Expect custom zero word "zero"
    expect(zeroResult).toBe("zero");
  });

  describe("Date conversion", () => {
    test("Convert Jalali date to words using slash format (1404/03/24)", () => {
      const result = converter.convertDateToWords("1404/03/24");
      // Expected output: "بیست و چهار خرداد یک هزار و چهارصد و چهار"
      expect(result).toBe("بیست و چهار خرداد یک هزار و چهارصد و چهار");
    });

    test("Convert Jalali date to words using dash format (1404-03-24)", () => {
      const result = converter.convertDateToWords("1404-03-24");
      // Expected output: "بیست و چهار خرداد یک هزار و چهارصد و چهار"
      expect(result).toBe("بیست و چهار خرداد یک هزار و چهارصد و چهار");
    });

    test("Convert Gregorian date to words (2023-04-05)", () => {
      const result = converter.convertDateToWords("2023-04-05", "gregorian");
      // For day "05" -> "پنج" and month "04" -> "آوریل", year "2023" -> "دو هزار و بیست و سه"
      // Expected output: "پنج آوریل دو هزار و بیست و سه"
      expect(result).toBe("پنج آوریل دو هزار و بیست و سه");
    });
  });

  describe("convertTimeToWords", () => {
    let converter: HarfizerConverter;

    beforeEach(() => {
      converter = new HarfizerConverter();
    });

    test("should convert time '09:05' with default prefix", () => {
      const result = converter.convertTimeToWords("09:05");
      // Expected conversion: "ساعت نه و پنج دقیقه"
      expect(result).toBe("ساعت نه و پنج دقیقه");
    });

    test("should convert time '18:00' with default prefix", () => {
      const result = converter.convertTimeToWords("18:00");
      // Expected conversion: "ساعت هجده"
      expect(result).toBe("ساعت هجده");
    });

    test("should convert time with custom time prefix", () => {
      const customConverter = new HarfizerConverter({
        customTimePrefix: "زمان",
      });
      const result = customConverter.convertTimeToWords("09:05");
      // Expected conversion with custom prefix: "زمان نه و پنج دقیقه"
      expect(result).toBe("زمان نه و پنج دقیقه");
    });

    test("should throw error for invalid time format", () => {
      expect(() => converter.convertTimeToWords("9-05")).toThrow(
        "Invalid time format. Expected format 'HH:mm'."
      );
    });
  });
});
