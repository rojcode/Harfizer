
# Harfizer - Number, Date & Time to Persian Words  
**تبدیل عدد، تاریخ و زمان به حروف فارسی با TypeScript**

📘 English & فارسی Documentation

---

## 📦 Overview | نمای کلی

**Harfizer** is a modern, TypeScript-native package for converting numbers into their **Persian word** representation.  
It supports integers, decimals, and negative numbers with rich customization options (such as separators, lexicons, and decimal suffixes).

In addition to number conversion, Harfizer now supports converting dates and digital time strings into Persian words.  
This means you can now convert both dates (Solar/Jalali or Gregorian) and digital time (HH:mm) to their Persian word equivalents.

**Harfizer** یک پکیج تایپ‌اسکریپتی مدرن برای تبدیل اعداد به **حروف فارسی** است.  
این پکیج از اعداد صحیح، اعشاری و منفی پشتیبانی می‌کند و با ارائه گزینه‌های متنوع، امکان سفارشی‌سازی کامل خروجی (مانند جداکننده‌ها، واژگان و پسوندهای اعشاری) را فراهم می‌سازد.

همچنین، Harfizer از تبدیل تاریخ‌ها و زمان دیجیتال به حروف فارسی پشتیبانی می‌کند.  
این بدان معناست که اکنون می‌توانید تاریخ (شمسی/میلادی) و زمان (به فرمت HH:mm) را به معادل حروف فارسی آن‌ها تبدیل کنید.

---

## 🛠 Installation | نصب

```bash
npm install harfizer
```

---

## 🚀 Basic Usage | استفاده ساده

### Converting Numbers | تبدیل عدد

```ts
import { HarfizerConverter } from 'harfizer';

console.log(HarfizerConverter.toWords(1234));
// Output: "یک هزار و دویست و سی و چهار"
```

```ts
console.log(HarfizerConverter.toWords("10500.25"));
// Output: "ده هزار و پانصد ممیز بیست و پنج صدم"
```

### Converting Dates | تبدیل تاریخ

```ts
import { HarfizerConverter } from 'harfizer';

const converter = new HarfizerConverter();

// Convert a Jalali (Solar) date:
console.log(converter.convertDateToWords("1404-03-24"));
// Expected Output: "بیست و چهار خرداد یک هزار و چهارصد و چهار"

// Convert a Gregorian date:
console.log(converter.convertDateToWords("2023-04-05", "gregorian"));
// Expected Output: "پنج آوریل دو هزار و بیست و سه"
```

### Converting Time | تبدیل زمان

```ts
import { HarfizerConverter } from 'harfizer';

const converter = new HarfizerConverter();

console.log(converter.convertTimeToWords("09:05"));
// Expected Output: "ساعت نه و پنج دقیقه"

console.log(converter.convertTimeToWords("18:00"));
// Expected Output: "ساعت هجده"
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

You can customize the output of Harfizer using the following options:

| Option                 | Type         | Default      | توضیح فارسی                           |
|------------------------|--------------|--------------|----------------------------------------|
| `useNegativeWord`      | `boolean`    | `true`       | استفاده از کلمه "منفی"                 |
| `customSeparator`      | `string`     | `" و "`     | جداکننده بین بخش‌ها                   |
| `customLexicon`        | `Lexicon`    | پیش‌فرض فارسی | واژگان سفارشی                        |
| `customDecimalSuffixes`| `string[]`   | پیش‌فرض فارسی | پسوندهای اعشاری                     |
| `customNegativeWord`   | `string`     | `"منفی "`   | واژه منفی دلخواه                      |
| `customZeroWord`       | `string`     | `"صفر"`     | معادل صفر دلخواه                      |
| `customTimePrefix`     | `string`     | `"ساعت"`   | پیشوند زمان برای تبدیل زمان          |

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
const funnyLexicon = [...]; // واژگان سفارشی خودتان

HarfizerConverter.toWords(12, { customLexicon: funnyLexicon });
// خروجی: بر اساس واژگان سفارشی
```

#### ✅ `customTimePrefix` (برای تبدیل زمان)

```ts
import { HarfizerConverter, ConversionOptions } from 'harfizer';

const options: ConversionOptions = { customTimePrefix: "زمان" };
const customConverter = new HarfizerConverter(options);

console.log(customConverter.convertTimeToWords("09:05"));
// خروجی مورد انتظار: "زمان نه و پنج دقیقه"
```

---

## 🧱 Lexicon Structure | ساختار واژگان

```ts
type Lexicon = [
  units[],       // یک تا نه
  tenToTwenty[], // ده تا بیست
  tens[],        // بیست تا نود
  hundreds[],    // یکصد تا نهصد
  scales[]       // هزار، میلیون، میلیارد و ...
];
```

---

## 💼 Advanced Usage | استفاده پیشرفته

### Instance-based usage:

```ts
const converter = new HarfizerConverter({ customZeroWord: "هیچ" });

console.log(converter.convert("0.75"));
// خروجی: "هفتاد و پنج صدم"
```

### Convert Triple Digits Only | تبدیل تنها ارقام سه رقمی

```ts
console.log(converter.convertTripleToWords(215));
// خروجی: "دویست و پانزده"
```

---

## 📆 Date Conversion | تبدیل تاریخ

Harfizer supports converting dates to their Persian word representation using the `convertDateToWords` method.  
This method accepts a date string in either `YYYY/MM/DD` or `YYYY-MM-DD` format and an optional calendar type:
- `"jalali"` for Solar dates (default)
- `"gregorian"` for Gregorian dates

```ts
import { HarfizerConverter } from 'harfizer';

const converter = new HarfizerConverter();

// Convert a Jalali (Solar) date:
console.log(converter.convertDateToWords("1404-03-24"));
// Expected Output: "بیست و چهار خرداد یک هزار و چهارصد و چهار"

// Convert a Gregorian date:
console.log(converter.convertDateToWords("2023-04-05", "gregorian"));
// Expected Output: "پنج آوریل دو هزار و بیست و سه"
```

---

## ⏰ Time Conversion | تبدیل زمان

Harfizer also converts digital time strings to Persian words using the `convertTimeToWords` method.  
It accepts a time string in the format `"HH:mm"` and returns its Persian word representation.  
A custom time prefix can be provided via `customTimePrefix` (default is `"ساعت"`).

```ts
import { HarfizerConverter } from 'harfizer';

const converter = new HarfizerConverter();

console.log(converter.convertTimeToWords("09:05"));
// Expected Output: "ساعت نه و پنج دقیقه"

console.log(converter.convertTimeToWords("18:00"));
// Expected Output: "ساعت هجده"
```

---

## 📏 Limitations | محدودیت‌ها

- **عدد:** حداکثر عدد ورودی 66 رقم (برای اعداد صحیح)
- **اعشار:** پشتیبانی از حداکثر 11 رقم اعشار
- **تاریخ:** فرمت‌های پشتیبانی شده `YYYY/MM/DD` و `YYYY-MM-DD`
- **زمان:** فرمت پشتیبانی شده برای زمان تنها `"HH:mm"` است.
- ورودی فقط باید عددی (برای تبدیل عدد) یا رشته‌های معتبر برای تاریخ و زمان باشد.

---

## 📚 License | مجوز

**MIT License**  
کاملاً متن‌باز و رایگان برای استفاده تجاری و شخصی.
