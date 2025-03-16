"use strict";
/**
 * @fileoverview
 * This test suite verifies the functionality of the CoreConverter class
 * in conjunction with the SpanishLanguagePlugin. It checks conversion
 * of numbers (including decimal and BigInt), dates (Gregorian), and times ("HH:mm").
 * Various edge cases such as invalid formats, out-of-range values,
 * custom separators, and custom words are also tested.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const spanishPlugin_1 = require("../plugins/spanishPlugin");
describe("CoreConverter with SpanishLanguagePlugin", () => {
    let converter;
    /**
     * Creates a fresh instance of CoreConverter with SpanishLanguagePlugin
     * before each test to ensure test isolation.
     */
    beforeEach(() => {
        const spanishPlugin = new spanishPlugin_1.SpanishLanguagePlugin();
        converter = new core_1.CoreConverter(spanishPlugin);
    });
    test("Convert positive number with decimal part (12345.67)", () => {
        // Explanation:
        // Integer part "12345" splits into: ["12", "345"]
        // "12" → convertBelowThousand(12): since 12 < 20 → "doce"
        //   Scale for first group (index 0): scale index = 2 - 0 - 1 = 1 → "mil"
        //   => "doce mil"
        // "345" → convertBelowThousand(345):
        //   hundreds: 3 → "trescientos"
        //   remainder: 45 → tens = 4, unit = 5 → "cuarenta y cinco"
        //   => "trescientos cuarenta y cinco"
        // Joined: "doce mil trescientos cuarenta y cinco"
        // Fractional part "67" is processed digit-by-digit:
        //   "6" → "seis", "7" → "siete"
        // Final expected result:
        // "doce mil trescientos cuarenta y cinco punto seis siete"
        const result = converter.convertNumber(12345.67);
        expect(result).toBe("doce mil trescientos cuarenta y cinco punto seis siete");
    });
    test("Convert zero", () => {
        const result = converter.convertNumber(0);
        expect(result).toBe("cero");
    });
    test("Convert negative number (-11)", () => {
        // 11 is less than 20 so: "once"
        // Expected: "menos once"
        const result = converter.convertNumber(-11);
        expect(result).toBe("menos once");
    });
    test("Use custom separator", () => {
        // For 12345, expected tokens: ["doce mil", "trescientos cuarenta y cinco"]
        // Joined with " - " yields: "doce mil - trescientos cuarenta y cinco"
        const options = { customSeparator: " - " };
        const result = converter.convertNumber(12345, options);
        expect(result).toBe("doce mil - trescientos cuarenta y cinco");
    });
    test("Dynamic configuration: custom negative and zero words", () => {
        const customOptions = {
            customNegativeWord: "menos_custom",
            customZeroWord: "cero_custom",
            customSeparator: " - ",
        };
        const negativeResult = converter.convertNumber(-11, customOptions);
        expect(negativeResult).toBe("menos_custom - once");
        const zeroResult = converter.convertNumber(0, customOptions);
        expect(zeroResult).toBe("cero_custom");
    });
    test("Convert triple number with convertTripleToWords (456)", () => {
        // 456 → Expected: "cuatrocientos cincuenta y seis"
        const result = converter.convertTripleToWords(456);
        expect(result).toBe("cuatrocientos cincuenta y seis");
    });
    test("Convert triple number with convertTripleToWords (345)", () => {
        // 345 → Expected: "trescientos cuarenta y cinco"
        const result = converter.convertTripleToWords(345);
        expect(result).toBe("trescientos cuarenta y cinco");
    });
    test('Process input with comma separators ("1,234,567.89")', () => {
        // "1,234,567.89" becomes "1234567.89", split into groups: ["1", "234", "567"]
        // "1" → "uno" with scale index 2 → SCALE[2] = "millón" (since 1 is singular) → "uno millón"
        // "234" → convertTripleToWords("234") → 234: "doscientos treinta y cuatro"
        //         Scale index for group "234": 3-1-1 = 1 → SCALE[1] = "mil" → "doscientos treinta y cuatro mil"
        // "567" → convertTripleToWords("567") → 567: "quinientos sesenta y siete"
        // Fractional part "89" → digit-by-digit: "ocho" "nueve", with "punto" prefixed
        // Final expected:
        // "uno millón doscientos treinta y cuatro mil quinientos sesenta y siete punto ocho nueve"
        const result = converter.convertNumber("1,234,567.89");
        expect(result).toBe("uno millón doscientos treinta y cuatro mil quinientos sesenta y siete punto ocho nueve");
    });
    test('Process input with space separators ("1 234 567.89")', () => {
        const result = converter.convertNumber("1 234 567.89");
        expect(result).toBe("uno millón doscientos treinta y cuatro mil quinientos sesenta y siete punto ocho nueve");
    });
    test('Process input with dash separators ("1-2343-53123")', () => {
        // "1-2343-53123" becomes "1234353123"
        // Expected groups (after splitting into triples): ["1", "234", "353", "123"]
        // "1" → "uno" with scale index 3: SCALE[3] = "mil millones" → "uno mil millones"
        // "234" → "doscientos treinta y cuatro" with scale index 2: SCALE[2] = "millón" → since 234>1, becomes "millones" → "doscientos treinta y cuatro millones"
        // "353" → "trescientos cincuenta y tres" with scale index 1: SCALE[1] = "mil" → "trescientos cincuenta y tres mil"
        // "123" → "ciento veintitrés" with no scale.
        const result = converter.convertNumber("1-2343-53123");
        expect(result).toBe("uno mil millones doscientos treinta y cuatro millones trescientos cincuenta y tres mil ciento veintitrés");
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
            // Expected:
            // Day: "5" → convertNumber(5) → "cinco"
            // Month: April → "abril"
            // Year: "2023" → convertNumber("2023") → "dos mil veintitrés"
            // Final: "cinco de abril de dos mil veintitrés"
            const result = converter.convertDateToWords("2023-04-05", "gregorian");
            expect(result).toBe("cinco de abril de dos mil veintitrés");
        });
        test("Convert Gregorian date to words using slash format (2023/04/05)", () => {
            const result = converter.convertDateToWords("2023/04/05", "gregorian");
            expect(result).toBe("cinco de abril de dos mil veintitrés");
        });
    });
    describe("convertTimeToWords", () => {
        test("should convert time '09:05' correctly", () => {
            // For 09:05, convert 9 to "nueve" and 5 to "cinco".
            // Since 9 != 1, expected output: "Son las nueve y cinco minutos"
            const result = converter.convertTimeToWords("09:05");
            expect(result).toBe("Son las nueve y cinco minutos");
        });
        test("should convert time '18:00' correctly", () => {
            // For 18:00, 18 mod 12 = 6 → "seis"
            // Expected output: "Son las seis en punto"
            const result = converter.convertTimeToWords("18:00");
            expect(result).toBe("Son las seis en punto");
        });
        test("should throw error for invalid time format", () => {
            expect(() => converter.convertTimeToWords("9-05")).toThrow("Invalid time format. Expected format 'HH:mm'.");
        });
    });
});
