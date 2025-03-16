

# Harfizer — Say Your Numbers, Dates, and Times Out Loud (in Any Language!)

**Harfizer** is a powerful package for converting numbers, dates, and times into words. It supports multiple languages including [🇮🇷 Persian](./docs/persian.md), [🇫🇷 French](./docs/french.md), [🇯🇵 Japanese](./docs/japanese.md), [🇨🇳 Chinese](./docs/chinese.md), [🇷🇺 Russian](./docs/russian.md), [🇩🇪 German](./docs/german.md), and [🇪🇸 Spanish](./docs/spanish.md). By using language-specific plugins, Harfizer allows you to easily convert numeric and temporal values into their textual representations.  
If you prefer a language other than English, please check the respective documentation by clicking on the links provided above or at the end of this document.


## Table of Contents
- [Harfizer — Say Your Numbers, Dates, and Times Out Loud (in Any Language!)](#harfizer--say-your-numbers-dates-and-times-out-loud-in-any-language)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Methods](#methods)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [Examples](#examples)
  - [Additional Options](#additional-options)
  - [Other Language Plugins Documentation](#other-language-plugins-documentation)
  - [License](#license)

## Installation

Install Harfizer via npm:

```bash
npm install harfizer
```

## Usage

Import the plugin and the `CoreConverter` from the package:

```typescript
import { CoreConverter, EnglishLanguagePlugin } from 'harfizer';

const englishPlugin = new EnglishLanguagePlugin();
const converter = new CoreConverter(englishPlugin);
```

## Methods

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
Converts a given number (integer or decimal, possibly negative) into its English textual form. It handles the fractional part digit-by-digit using the word "point".

**Parameters:**
- **input:** A number, numeric string, or bigint.
- **options (optional):** An object to customize conversion:
  - `customZeroWord` – overrides the default word for zero.
  - `customNegativeWord` – overrides the default negative word.
  - `customSeparator` – overrides the default token separator.

**Returns:**  
A string representing the number in words.

**Example:**

```typescript
converter.convertNumber("123"); 
// Output: "one hundred twenty-three"

converter.convertNumber("-456.78"); 
// Output: "minus four hundred fifty-six point seven eight"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
Converts a three-digit (or fewer) number into its English textual representation.

**Parameters:**
- **num:** A numeric value (up to 3 digits).

**Returns:**  
A string representing the three-digit number (e.g., "four hundred fifty-six").

**Example:**

```typescript
converter.convertTripleToWords(789); 
// Output: "seven hundred eighty-nine"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
Converts a Gregorian date string (formatted as "YYYY/MM/DD" or "YYYY-MM-DD") into its English textual representation in the format "Month Day, Year".

**Parameters:**
- **dateStr:** The date string.
- **calendar (optional):** For English, use "gregorian" (default is "gregorian").

**Returns:**  
A string representing the date in words.

**Example:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// Output: "April 5, two thousand twenty-three"
```

---

### `convertTimeToWords(timeStr: string): string`
Converts a time string in "HH:mm" format into its English textual representation.  
If minutes are zero, returns "It is <hour> o'clock"; otherwise, returns "It is <hour> o'clock and <minute> minutes".

**Parameters:**
- **timeStr:** A time string in "HH:mm" format.

**Returns:**  
A string representing the time in words.

**Example:**

```typescript
converter.convertTimeToWords("09:00"); 
// Output: "It is nine o'clock"

converter.convertTimeToWords("09:05"); 
// Output: "It is nine o'clock and five minutes"
```

## Examples

Here is an example of using the `EnglishLanguagePlugin` with `CoreConverter`:

```typescript
import { CoreConverter, EnglishLanguagePlugin } from 'harfizer';

const englishPlugin = new EnglishLanguagePlugin();
const converter = new CoreConverter(englishPlugin);

console.log(converter.convertNumber("123")); 
// Output: "one hundred twenty-three"

console.log(converter.convertDateToWords("2023/04/05")); 
// Output: "April 5, two thousand twenty-three"

console.log(converter.convertTimeToWords("09:05")); 
// Output: "It is nine o'clock and five minutes"
```

## Additional Options

The `convertNumber` method accepts an optional `ConversionOptions` object for customizing conversion:

```typescript
const options = {
  customZeroWord: "nil",
  customNegativeWord: "negative",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// Output: "negative one hundred twenty-three"
```

## Other Language Plugins Documentation

For documentation on other language plugins, please refer to the following files:

- [🇬🇧 EnglishLanguagePlugin Documentation](./README.md)
- [🇮🇷 PersianLanguagePlugin Documentation](./docs/persian.md)
- [🇫🇷 FrenchLanguagePlugin Documentation](./docs/french.md)
- [🇯🇵 JapaneseLanguagePlugin Documentation](./docs/japanese.md)
- [🇨🇳 ChineseLanguagePlugin Documentation](./docs/chinese.md)
- [🇷🇺 RussianLanguagePlugin Documentation](./docs/russian.md)
- [🇩🇪 GermanLanguagePlugin Documentation](./docs/german.md)
- [🇪🇸 SpanishLanguagePlugin Documentation](./docs/spanish.md)



## License

This package is licensed under the MIT License.

