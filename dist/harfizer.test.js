"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harfizer_1 = require("./harfizer");
describe("HarfizerConverter", () => {
    let converter;
    beforeEach(() => {
        converter = new harfizer_1.HarfizerConverter();
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
        const options = { customSeparator: "، " };
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
        expect(result).toBe("یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم");
    });
    test('Process input with space separators ("1 234 567.89")', () => {
        const result = converter.convert("1 234 567.89");
        // Expected to be the same as above after removal of spaces
        expect(result).toBe("یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه صدم");
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
        expect(result).toBe("یک میلیارد و دویست و سی و چهار میلیون و سیصد و پنجاه و سه هزار و یکصد و بیست و سه");
    });
    test("Convert using BigInt input", () => {
        const bigIntInput = BigInt("123456789123456789");
        // Just assert that the conversion does not throw and returns a non-empty string.
        expect(() => converter.convert(bigIntInput)).not.toThrow();
        const result = converter.convert(bigIntInput);
        expect(result.length).toBeGreaterThan(0);
    });
    test("Throw error for invalid input format", () => {
        expect(() => converter.convert("abc123")).toThrow("Error: Invalid input format.");
    });
    test("Throw error for out-of-range input", () => {
        // Create a number string with 67 digits.
        const outOfRangeInput = "1".repeat(67);
        expect(() => converter.convert(outOfRangeInput)).toThrow("Error: Out of range.");
    });
    test("Dynamic configuration: custom negative and zero words", () => {
        const customOptions = {
            customNegativeWord: "minus",
            customZeroWord: "zero",
            customSeparator: " - ",
        };
        const customConverter = new harfizer_1.HarfizerConverter(customOptions);
        const negativeResult = customConverter.convert(-11);
        // Expect custom negative word "minus" instead of default "منفی"
        expect(negativeResult).toBe("minus یازده");
        const zeroResult = customConverter.convert(0);
        // Expect custom zero word "zero"
        expect(zeroResult).toBe("zero");
    });
});
