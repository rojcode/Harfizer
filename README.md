


# Harfizer — Say Your Numbers, Dates, and Times Out Loud (in Any Language!)

> **Convert numbers, dates, and times into words — in 7+ languages, with style.**

[![npm version](https://img.shields.io/npm/v/harfizer)](https://www.npmjs.com/package/harfizer)
![Languages](https://img.shields.io/badge/Languages-7+-blueviolet)
![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178c6)
![License](https://img.shields.io/npm/l/harfizer)
![npm](https://img.shields.io/npm/dt/harfizer)

**Harfizer** is a powerful and extensible package for converting numbers, dates, and times into human-readable words — now supporting 7+ languages including [🇮🇷 Persian](./docs/persian.md), [🇫🇷 French](./docs/french.md), [🇯🇵 Japanese](./docs/japanese.md), [🇨🇳 Chinese](./docs/chinese.md), [🇷🇺 Russian](./docs/russian.md), [🇩🇪 German](./docs/german.md), and [🇪🇸 Spanish](./docs/spanish.md).  
Built with a plugin-based architecture, Harfizer allows seamless internationalization and high configurability.

If you prefer a language other than English, see the respective documentation above or at the end of this document.

---

## ✨ Features

- ✅ Convert numbers (integers, decimals, negatives)
- ✅ Convert Gregorian or Jalali dates
- ✅ Convert time (HH:mm) to natural text
- ✅ Supports 66-digit numbers
- ✅ 7+ language plugins — easily extendable
- ✅ Customizable output with options

## 💡 Why Harfizer?

- 🌍 **Multilingual** support (7+ languages and growing)
- 🔢 **Handles large numbers** (up to 66 digits, decimals, negatives)
- 📅 **Date and time conversion** with natural phrasing
- 🔌 **Plugin-based** and highly extensible
- ⚙️ **Customizable** with `ConversionOptions`
- ✅ Built with **TypeScript** — fully typed, safe, and modern

---

## 🌐 Supported Languages

| Flag | Language | Plugin |
|------|----------|--------|
| 🇬🇧  | English  | ✅ `EnglishLanguagePlugin` |
| 🇮🇷  | Persian  | ✅ `PersianLanguagePlugin` |
| 🇫🇷  | French   | ✅ `FrenchLanguagePlugin` |
| 🇯🇵  | Japanese | ✅ `JapaneseLanguagePlugin` |
| 🇨🇳  | Chinese  | ✅ `ChineseLanguagePlugin` |
| 🇷🇺  | Russian  | ✅ `RussianLanguagePlugin` |
| 🇩🇪  | German   | ✅ `GermanLanguagePlugin` |
| 🇪🇸  | Spanish  | ✅ `SpanishLanguagePlugin` |

> More languages coming soon...

---

## 📦 Installation

Install Harfizer via npm:

```bash
npm install harfizer
```

---

## 🚀 Usage

Import the plugin and the `CoreConverter` from the package:

```ts
import { CoreConverter, EnglishLanguagePlugin } from 'harfizer';

const englishPlugin = new EnglishLanguagePlugin();
const converter = new CoreConverter(englishPlugin);
```

---

## 🧠 Methods

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`

Converts an integer, decimal, or negative number to words (digit-by-digit for decimals).

```ts
converter.convertNumber("123");
// Output: "one hundred twenty-three"

converter.convertNumber("-456.78");
// Output: "minus four hundred fifty-six point seven eight"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`

Converts a number with up to 3 digits.

```ts
converter.convertTripleToWords(789);
// Output: "seven hundred eighty-nine"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`

Converts a date string to spoken form.

```ts
converter.convertDateToWords("2023/04/05");
// Output: "April 5, two thousand twenty-three"
```

---

### `convertTimeToWords(timeStr: string): string`

Converts a time string in "HH:mm" format to spoken form.

```ts
converter.convertTimeToWords("09:00");
// Output: "It is nine o'clock"

converter.convertTimeToWords("09:05");
// Output: "It is nine o'clock and five minutes"
```

---

## 📘 Examples

```ts
import { CoreConverter, EnglishLanguagePlugin } from 'harfizer';

const plugin = new EnglishLanguagePlugin();
const converter = new CoreConverter(plugin);

console.log(converter.convertNumber("123")); 
console.log(converter.convertDateToWords("2023/04/05")); 
console.log(converter.convertTimeToWords("09:05"));
```

---

## ⚙️ Additional Options

Customize your number output:

```ts
const options = {
  customZeroWord: "nil",
  customNegativeWord: "negative",
  customSeparator: " "
};

converter.convertNumber("-123", options);
// Output: "negative one hundred twenty-three"
```

---

## 🌍 Other Language Plugins Documentation

- [🇬🇧 English](./README.md)
- [🇮🇷 Persian](./docs/persian.md)
- [🇫🇷 French](./docs/french.md)
- [🇯🇵 Japanese](./docs/japanese.md)
- [🇨🇳 Chinese](./docs/chinese.md)
- [🇷🇺 Russian](./docs/russian.md)
- [🇩🇪 German](./docs/german.md)
- [🇪🇸 Spanish](./docs/spanish.md)

---

## 📄 License

MIT

---

### 💬 Have suggestions or want to contribute?

Open an issue or PR on [GitHub](https://github.com/rojcode/harfizer)! Contributions welcome 🌟

