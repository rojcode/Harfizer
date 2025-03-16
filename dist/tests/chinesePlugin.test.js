"use strict";
/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the ChineseLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const chinesePlugin_1 = require("../plugins/chinesePlugin");
describe("CoreConverter with ChineseLanguagePlugin", () => {
    let converter;
    /**
     * Creates a fresh instance of CoreConverter with ChineseLanguagePlugin
     * before each test to ensure test isolation.
     */
    beforeEach(() => {
        const chinesePlugin = new chinesePlugin_1.ChineseLanguagePlugin();
        converter = new core_1.CoreConverter(chinesePlugin);
    });
    test("Convert positive number with decimal part (12345.67)", () => {
        // For 12345.67, the integer part "12345" is split into:
        //   Group1: "1" → "一" with scale "万" → "一万"
        //   Group2: "2345" → "二千三百四十五"
        // Joined with a space: "一万 二千三百四十五"
        // Fractional part "67" → "六" and "七", joined as: "点 六 七"
        // Expected final result: "一万 二千三百四十五 点 六 七"
        const result = converter.convertNumber(12345.67);
        expect(result).toBe("一万 二千三百四十五 点 六 七");
    });
    test("Convert zero", () => {
        // Zero should return the default Chinese word "零".
        const result = converter.convertNumber(0);
        expect(result).toBe("零");
    });
    test("Convert negative number (-11)", () => {
        // For negative numbers, "负" should prefix the conversion.
        // 11 is converted as "十一".
        const result = converter.convertNumber(-11);
        expect(result).toBe("负 十一");
    });
    test("Use custom separator", () => {
        // When a custom separator is provided, tokens are joined with it.
        // For 12345, expected tokens: ["一万", "二千三百四十五"]
        // Joined with " - " yields: "一万 - 二千三百四十五"
        const options = { customSeparator: " - " };
        const result = converter.convertNumber(12345, options);
        expect(result).toBe("一万 - 二千三百四十五");
    });
    test("Dynamic configuration: custom negative and zero words", () => {
        const customOptions = {
            customNegativeWord: "负_custom",
            customZeroWord: "零_custom",
            customSeparator: " - ",
        };
        const negativeResult = converter.convertNumber(-11, customOptions);
        expect(negativeResult).toBe("负_custom - 十一");
        const zeroResult = converter.convertNumber(0, customOptions);
        expect(zeroResult).toBe("零_custom");
    });
    test("Convert triple number with convertTripleToWords (456)", () => {
        // 456 should be converted to "四百五十六".
        const result = converter.convertTripleToWords(456);
        expect(result).toBe("四百五十六");
    });
    test("Convert triple number with convertTripleToWords (345)", () => {
        // 345 should be converted to "三百四十五".
        const result = converter.convertTripleToWords(345);
        expect(result).toBe("三百四十五");
    });
    test('Process input with comma separators ("1,234,567.89")', () => {
        // "1,234,567.89" becomes "1234567.89".
        // Integer part "1234567" splits into groups: ["123", "4567"]
        //   Group1: "123" → "一百二十三" then append scale "万" → "一百二十三万"
        //   Group2: "4567" → "四千五百六十七"
        // Joined: "一百二十三万 四千五百六十七"
        // Fractional part "89" → "八" and "九" → "点 八 九"
        // Expected final result: "一百二十三万 四千五百六十七 点 八 九"
        const result = converter.convertNumber("1,234,567.89");
        expect(result).toBe("一百二十三万 四千五百六十七 点 八 九");
    });
    test('Process input with space separators ("1 234 567.89")', () => {
        // Similar to comma separators.
        const result = converter.convertNumber("1 234 567.89");
        expect(result).toBe("一百二十三万 四千五百六十七 点 八 九");
    });
    test('Process input with dash separators ("1-2343-53123")', () => {
        // "1-2343-53123" becomes "1234353123".
        // Splitting into quadruple groups gives: ["12", "3435", "3123"]
        // Group1: "12" → "十二" + scale "亿" → "十二亿"
        // Group2: "3435" → "三千四百三十五" + scale "万" → "三千四百三十五万"
        // Group3: "3123" → "三千一百二十三"
        // Joined: "十二亿 三千四百三十五万 三千一百二十三"
        const result = converter.convertNumber("1-2343-53123");
        expect(result).toBe("十二亿 三千四百三十五万 三千一百二十三");
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
        const outOfRangeInput = "1".repeat(67);
        expect(() => converter.convertNumber(outOfRangeInput)).toThrow("Error: Out of range.");
    });
    describe("Date conversion", () => {
        test("Convert Gregorian date to words (2023-04-05)", () => {
            // Expected output based on current implementation: "二千零二十三年四月五日"
            const result = converter.convertDateToWords("2023-04-05", "gregorian");
            expect(result).toBe("二千零二十三年四月五日");
        });
        test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
            const result = converter.convertDateToWords("2023/04/05", "gregorian");
            expect(result).toBe("二千零二十三年四月五日");
        });
    });
    describe("convertTimeToWords", () => {
        test("should convert time '09:05' correctly", () => {
            // 9 → "九", 5 → "五"; expected: "九时五分"
            const result = converter.convertTimeToWords("09:05");
            expect(result).toBe("九时五分");
        });
        test("should convert time '18:00' correctly", () => {
            // 18 → "十八"; expected: "十八时"
            const result = converter.convertTimeToWords("18:00");
            expect(result).toBe("十八时");
        });
        test("should throw error for invalid time format", () => {
            expect(() => converter.convertTimeToWords("9-05")).toThrow("Invalid time format. Expected format 'HH:mm'.");
        });
    });
});
