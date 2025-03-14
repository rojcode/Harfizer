

# Harfizer - Number to Persian Words  
**تبدیل عدد به حروف فارسی با TypeScript**

📘 English & فارسی Documentation

---

## 📦 Overview | نمای کلی

**Harfizer** is a modern, TypeScript-native package for converting numbers into their **Persian word** representation. It supports integers, decimals, and negative numbers, with rich customization options including separators, lexicons, and decimal suffixes.

**Harfizer** یک پکیج تایپ‌اسکریپتی مدرن برای تبدیل اعداد به **حروف فارسی** است. این پکیج از اعداد صحیح، اعشاری و منفی پشتیبانی می‌کند و با ارائه گزینه‌های متنوع، امکان سفارشی‌سازی کامل خروجی را فراهم می‌سازد.

---

## 🙏 Acknowledgements | قدردانی

We extend our sincere thanks to the creators of the [num2persian](https://www.npmjs.com/package/num2persian) package — an excellent JavaScript utility that made number-to-Persian-word conversion accessible years ago. Inspired by their work, we created **Harfizer** to provide a fully typed, flexible, and extensible solution for modern TypeScript-based applications.

ما صمیمانه از تیم پکیج [num2persian](https://www.npmjs.com/package/num2persian) تشکر می‌کنیم؛ ابزاری ارزشمند که سال‌ها پیش امکان تبدیل اعداد به حروف فارسی را در جاوااسکریپت فراهم کرد. به عنوان یک برنامه‌نویس که درگیر توسعه‌ی نرم‌افزارهای فارسی‌زبان هستم، وظیفه خود دانستم تا نسخه‌ای مدرن، امن و قابل گسترش برای TypeScript توسعه دهم و آن را با جامعه به اشتراک بگذارم.

---

## 🛠 Installation | نصب

```bash
npm install harfizer
```

---

## 🚀 Basic Usage | استفاده ساده

```ts
import { HarfizerConverter } from 'harfizer';

console.log(HarfizerConverter.toWords(1234));
// Output: "یک هزار و دویست و سی و چهار"
```

```ts
console.log(HarfizerConverter.toWords("10500.25"));
// Output: "ده هزار و پانصد ممیز بیست و پنج صدم"
```

---

## ➖ Negative Numbers | اعداد منفی

```ts
console.log(HarfizerConverter.toWords(-72));
// Output: "منفی هفتاد و دو"
```

```ts
console.log(HarfizerConverter.toWords("-0.01"));
// Output: "منفی یک صدم"
```

---

## ⚙️ Custom Options | تنظیمات سفارشی

شما می‌توانید خروجی Harfizer را با گزینه‌های دلخواه تغییر دهید:

| Option | Type | Default | توضیح فارسی |
|--------|------|---------|-------------|
| `useNegativeWord` | `boolean` | `true` | استفاده از کلمه "منفی" |
| `customSeparator` | `string` | `" و "` | جداکننده بین بخش‌ها |
| `customLexicon` | `Lexicon` | پیش‌فرض فارسی | واژگان سفارشی |
| `customDecimalSuffixes` | `string[]` | پیش‌فرض فارسی | پسوندهای اعشاری |
| `customNegativeWord` | `string` | `"منفی "` | واژه منفی دلخواه |
| `customZeroWord` | `string` | `"صفر"` | معادل صفر دلخواه |

### Examples | مثال‌ها

#### ✅ `useNegativeWord`

```ts
HarfizerConverter.toWords(-45, { useNegativeWord: false });
// خروجی: "چهل و پنج"
```

#### ✅ `customSeparator`

```ts
HarfizerConverter.toWords(123456, { customSeparator: "، " });
// خروجی: "یکصد و بیست و سه هزار، چهارصد و پنجاه و شش"
```

#### ✅ `customNegativeWord`

```ts
HarfizerConverter.toWords(-12, { customNegativeWord: "عدد منفی " });
// خروجی: "عدد منفی دوازده"
```

#### ✅ `customZeroWord`

```ts
HarfizerConverter.toWords(0, { customZeroWord: "هیچ" });
// خروجی: "هیچ"
```

#### ✅ `customDecimalSuffixes`

```ts
HarfizerConverter.toWords("0.04", {
  customDecimalSuffixes: ["", "دهم", "صدم", "هزارم", "ده‌هزارم"]
});
// خروجی: "چهار صدم"
```

#### ✅ `customLexicon`

```ts
const funnyLexicon = [...]; // your own words

HarfizerConverter.toWords(12, { customLexicon: funnyLexicon });
// خروجی: بر اساس واژگان سفارشی
```

---

## 🧱 Lexicon Structure | ساختار واژگان

```ts
type Lexicon = [
  units[],       // یک تا نه
  tenToTwenty[], // ده تا بیست
  tens[],        // بیست تا نود
  hundreds[],    // یکصد تا نهصد
  scales[],      // هزار، میلیون، میلیارد و ...
];
```

---

## 💼 Advanced Usage | استفاده پیشرفته

### Instance-based usage:

```ts
const converter = new HarfizerConverter({ customZeroWord: "هیچ" });

converter.convert("0.75");
// خروجی: "هفتاد و پنج صدم"
```

### Convert triple digits only:

```ts
converter.convertTripleToWords(215);
// خروجی: "دویست و پانزده"
```

---
## 📆 Date Conversion | تبدیل تاریخ

Harfizer now supports converting dates to their Persian word representation using the `convertDateToWords` method. This method accepts a date string in either `YYYY/MM/DD` or `YYYY-MM-DD` format, along with an optional calendar type (`"jalali"` for Solar dates or `"gregorian"` for Gregorian dates, default is `"jalali"`).

Harfizer اکنون از تبدیل تاریخ به حروف فارسی پشتیبانی می‌کند. با استفاده از متد `convertDateToWords` می‌توانید تاریخ‌ها را به رشته‌ای از حروف تبدیل کنید. این متد یک رشته تاریخ به فرمت `YYYY/MM/DD` یا `YYYY-MM-DD` و یک پارامتر تقویم اختیاری (`"jalali"` برای تاریخ شمسی یا `"gregorian"` برای تاریخ میلادی، پیش‌فرض `"jalali"`) را دریافت می‌کند.

### Example | مثال

```ts
import { HarfizerConverter } from 'harfizer';

const converter = new HarfizerConverter();

// Convert a Jalali (Solar) date using dash format:
console.log(converter.convertDateToWords("1404-03-24"));
// Expected Output: "بیست و چهار خرداد یک هزار و چهارصد و چهار"

// Convert a Gregorian date:
console.log(converter.convertDateToWords("2023-04-05", "gregorian"));
// Expected Output: "پنج آوریل دو هزار و بیست و سه"
```


## 📏 Limitations | محدودیت‌ها

- حداکثر عدد ورودی: 66 رقم (برای اعداد صحیح)
- پشتیبانی از حداکثر 11 رقم اعشار
- ورودی فقط باید عددی باشد (مقدارهای غیرعددی پشتیبانی نمی‌شوند)

---

## 📚 License | مجوز

**MIT License**  
کاملاً متن‌باز و رایگان برای استفاده تجاری و شخصی.

