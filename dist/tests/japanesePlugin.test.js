"use strict";
/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the JapaneseLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian),
 * and times ("HH:mm"). Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const japanesePlugin_1 = require("../plugins/japanesePlugin");
describe("CoreConverter with JapaneseLanguagePlugin", () => {
    let converter;
    /**
     * Creates a fresh instance of CoreConverter with JapaneseLanguagePlugin
     * before each test to ensure test isolation.
     */
    beforeEach(() => {
        const japanesePlugin = new japanesePlugin_1.JapaneseLanguagePlugin();
        converter = new core_1.CoreConverter(japanesePlugin);
    });
    test("Convert positive number with decimal part (12345.67)", () => {
        // For 12345.67, expected conversion:
        // Integer part: "12345" → split into groups: ["1", "2345"]
        //   Group1: "1" → "一" + scale "万" → "一万"
        //   Group2: "2345" → "二千三百四十五"
        // Joined with space: "一万 二千三百四十五"
        // Fractional part: "67" → "六" and "七", joined as: "点 六 七"
        // Final result: "一万 二千三百四十五 点 六 七"
        const result = converter.convertNumber(12345.67);
        expect(result).toBe("一万 二千三百四十五 点 六 七");
    });
    test("Convert zero", () => {
        // Zero should return the default word "零"
        const result = converter.convertNumber(0);
        expect(result).toBe("零");
    });
    test("Convert negative number (-11)", () => {
        // Negative numbers should be prefixed with "マイナス" followed by a space.
        // 11 is converted as "十一"
        const result = converter.convertNumber(-11);
        expect(result).toBe("マイナス 十一");
    });
    test("Use custom separator", () => {
        // When a custom separator is provided, tokens are joined with it.
        const options = { customSeparator: " - " };
        // For 12345, expected tokens: ["一万", "二千三百四十五"]
        // Joined: "一万 - 二千三百四十五"
        const result = converter.convertNumber(12345, options);
        expect(result).toBe("一万 - 二千三百四十五");
    });
    test("Dynamic configuration: custom negative and zero words", () => {
        const customOptions = {
            customNegativeWord: "マイナス_custom",
            customZeroWord: "零_custom",
            customSeparator: " - ",
        };
        const negativeResult = converter.convertNumber(-11, customOptions);
        expect(negativeResult).toBe("マイナス_custom - 十一");
        const zeroResult = converter.convertNumber(0, customOptions);
        expect(zeroResult).toBe("零_custom");
    });
    test("Convert triple number with convertTripleToWords (456)", () => {
        // 456 → "四百五十六"
        const result = converter.convertTripleToWords(456);
        expect(result).toBe("四百五十六");
    });
    test("Convert triple number with convertTripleToWords (345)", () => {
        // 345 → "三百四十五"
        const result = converter.convertTripleToWords(345);
        expect(result).toBe("三百四十五");
    });
    test('Process input with comma separators ("1,234,567.89")', () => {
        // "1,234,567.89" → remove commas → "1234567.89"
        // Integer part "1234567" splits into groups: ["123", "4567"]
        //   Group1: "123" → "百二十三" with scale "万" → "百二十三万"
        //   Group2: "4567" → "四千五百六十七"
        // Joined with default separator: "百二十三万 四千五百六十七"
        // Fractional part "89" → "八" and "九" → "点 八 九"
        // Final: "百二十三万 四千五百六十七 点 八 九"
        const result = converter.convertNumber("1,234,567.89");
        expect(result).toBe("百二十三万 四千五百六十七 点 八 九");
    });
    test('Process input with space separators ("1 234 567.89")', () => {
        // Similar to comma separators.
        const result = converter.convertNumber("1 234 567.89");
        expect(result).toBe("百二十三万 四千五百六十七 点 八 九");
    });
    test('Process input with dash separators ("1-2343-53123")', () => {
        // "1-2343-53123" → becomes "1234353123"
        // Splitting into quadruple groups yields: ["1", "2343", "53123"]? Let's simulate:
        // Actually, "1234353123" length=10 → groups: first: last 4 digits "3123", then remaining "3435" (4 digits), then "12" (2 digits)
        // Groups: ["12", "3435", "3123"]
        // Group1: "12" → "十二" with scale index 2 → append scale[2] = "億" → "十二億"
        // Group2: "3435" → convert: 3435 → "三千四百三十五" with scale index 1 → scale[1] = "万" → "三千四百三十五万"
        // Group3: "3123" → "三千百二十三" with scale index 0
        // Joined: "十二億 三千四百三十五万 三千百二十三"
        const result = converter.convertNumber("1-2343-53123");
        expect(result).toBe("十二億 三千四百三十五万 三千百二十三");
    });
    test("Convert using BigInt input", () => {
        const bigIntInput = BigInt("123456789123456789");
        expect(() => converter.convertNumber(bigIntInput)).not.toThrow();
        const result = converter.convertNumber(bigIntInput);
        expect(result.length).toBeGreaterThan(0);
    });
    test("Throw error for invalid input format", () => {
        expect(() => converter.convertNumber("abc123")).toThrow("Error: Invalid input format.");
    });
    test("Throw error for out-of-range input", () => {
        // A string with 67 digits should exceed the allowed length.
        const outOfRangeInput = "1".repeat(67);
        expect(() => converter.convertNumber(outOfRangeInput)).toThrow("Error: Out of range.");
    });
    describe("Date conversion", () => {
        test("Convert Gregorian date to words (2023-04-05)", () => {
            // Expected output: "二千二十三年四月五日"
            const result = converter.convertDateToWords("2023-04-05", "gregorian");
            expect(result).toBe("二千二十三年四月五日");
        });
        test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
            const result = converter.convertDateToWords("2023/04/05", "gregorian");
            expect(result).toBe("二千二十三年四月五日");
        });
    });
    describe("convertTimeToWords", () => {
        test("should convert time '09:05' with default prefix", () => {
            // 9 → "九", 5 → "五", so expected: "九時五分"
            const result = converter.convertTimeToWords("09:05");
            expect(result).toBe("九時五分");
        });
        test("should convert time '18:00' with default prefix", () => {
            // 18 → "十八", expected: "十八時"
            const result = converter.convertTimeToWords("18:00");
            expect(result).toBe("十八時");
        });
        test("should throw error for invalid time format", () => {
            expect(() => converter.convertTimeToWords("9-05")).toThrow("Invalid time format. Expected format 'HH:mm'.");
        });
    });
});
