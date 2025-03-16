# Harfizer — خواندن اعداد، تاریخ و زمان به زبان فارسی

**Harfizer** یک بسته قدرتمند است که برای تبدیل اعداد، تاریخ‌ها و زمان‌ها به متن فارسی طراحی شده است. این بسته با استفاده از پلاگین‌های زبان خاص، به شما امکان می‌دهد تا به سادگی اعداد و زمان‌ها را به نمایش متنی فارسی درآورید.  
اگر مایل به استفاده از زبان‌های دیگر هستید، می‌توانید از لینک‌های مستندات مربوطه در بالا یا پایین صفحه استفاده کنید.

## فهرست مطالب
- [Harfizer — خواندن اعداد، تاریخ و زمان به زبان فارسی](#harfizer--خواندن-اعداد-تاریخ-و-زمان-به-زبان-فارسی)
  - [فهرست مطالب](#فهرست-مطالب)
  - [نصب](#نصب)
  - [روش استفاده](#روش-استفاده)
  - [توابع](#توابع)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [مثال‌ها](#مثالها)
  - [گزینه‌های اضافی](#گزینههای-اضافی)
  - [مستندات پلاگین‌های زبان‌های دیگر](#مستندات-پلاگینهای-زبانهای-دیگر)
  - [مجوز](#مجوز)

## نصب

برای نصب Harfizer از npm استفاده کنید:

```bash
npm install harfizer
```

## روش استفاده

ابتدا پلاگین فارسی و کلاس CoreConverter را از بسته Harfizer وارد کنید:

```typescript
import { CoreConverter, PersianLanguagePlugin } from 'harfizer';

const persianPlugin = new PersianLanguagePlugin();
const converter = new CoreConverter(persianPlugin);
```

## توابع

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
این تابع یک عدد (صحیح یا اعشاری؛ امکان منفی بودن نیز وجود دارد) را به متن فارسی تبدیل می‌کند. در صورت وجود بخش اعشاری، هر رقم به صورت مجزا تبدیل شده و از عبارت "ممیز" برای جدا کردن بخش اعشار استفاده می‌شود.

**پارامترها:**
- **input:** عدد، رشته عددی یا bigint.
- **options (اختیاری):** شیئی برای سفارشی‌سازی فرایند تبدیل:
  - `customZeroWord` – تغییر کلمه پیش‌فرض "صفر".
  - `customNegativeWord` – تغییر کلمه پیش‌فرض "منفی".
  - `customSeparator` – تغییر جداکننده پیش‌فرض.

**مقدار بازگشتی:**  
رشته‌ای متنی که معادل عدد ورودی به زبان فارسی است.

**مثال:**

```typescript
converter.convertNumber("123"); 
// خروجی: "صد و بیست و سه"

converter.convertNumber("-456.78"); 
// خروجی: "منفی چهارصد و پنجاه و شش ممیز هفت و هشت"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
این تابع یک عدد با حداکثر چهار رقم (مناسب برای اعداد کمتر از 10,000) را به صورت متنی فارسی تبدیل می‌کند.

**پارامترها:**
- **num:** عدد با حداکثر ۴ رقم.

**مقدار بازگشتی:**  
رشته‌ای متنی که معادل عدد ورودی (مثلاً "چهارصد و پنجاه و شش") است.

**مثال:**

```typescript
converter.convertTripleToWords(789); 
// خروجی: "هفتصد و هشتاد و نه"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
این تابع یک رشته تاریخ به فرمت "YYYY/MM/DD" یا "YYYY-MM-DD" را به متن فارسی تبدیل می‌کند. خروجی شامل تبدیل روز و سال به اعداد متنی و نمایش نام ماه به زبان فارسی (بر اساس تقویم انتخابی) است.

**پارامترها:**
- **dateStr:** رشته تاریخ.
- **calendar (اختیاری):** نوع تقویم؛ "jalali" یا "gregorian"؛ پیش‌فرض "jalali".

**مقدار بازگشتی:**  
رشته‌ای متنی که معادل تاریخ ورودی به زبان فارسی است.

**مثال:**

```typescript
converter.convertDateToWords("1402/05/17"); 
// خروجی: "هفدهم مرداد یک هزار و چهارصد و دو"
```

---

### `convertTimeToWords(timeStr: string): string`
این تابع یک رشته زمان به فرمت "HH:mm" را به متن فارسی تبدیل می‌کند. خروجی به صورت "ساعت <ساعت> و <دقیقه> دقیقه" است؛ در صورتی که دقیقه صفر باشد، فقط ساعت نمایش داده می‌شود.

**پارامترها:**
- **timeStr:** رشته زمان به فرمت "HH:mm".

**مقدار بازگشتی:**  
رشته‌ای متنی که معادل زمان ورودی به زبان فارسی است.

**مثال:**

```typescript
converter.convertTimeToWords("09:00"); 
// خروجی: "ساعت نه"

converter.convertTimeToWords("09:05"); 
// خروجی: "ساعت نه و پنج دقیقه"
```

## مثال‌ها

نمونه زیر نحوه استفاده از `PersianLanguagePlugin` و `CoreConverter` را نشان می‌دهد:

```typescript
import { CoreConverter, PersianLanguagePlugin } from 'harfizer';

const persianPlugin = new PersianLanguagePlugin();
const converter = new CoreConverter(persianPlugin);

console.log(converter.convertNumber("123")); 
// خروجی: "صد و بیست و سه"

console.log(converter.convertDateToWords("1402/05/17")); 
// خروجی: "هفدهم مرداد یک هزار و چهارصد و دو"

console.log(converter.convertTimeToWords("09:05")); 
// خروجی: "ساعت نه و پنج دقیقه"
```

## گزینه‌های اضافی

تابع `convertNumber` امکان پذیرش شیئی به نام `ConversionOptions` را دارد تا بتوانید فرایند تبدیل را سفارشی کنید:

```typescript
const options = {
  customZeroWord: "صفر",
  customNegativeWord: "منفی",
  customSeparator: " و "
};

console.log(converter.convertNumber("-123", options)); 
// خروجی: "منفی صد و بیست و سه"
```

## مستندات پلاگین‌های زبان‌های دیگر

برای مشاهده مستندات سایر پلاگین‌های زبان، لطفاً به موارد زیر مراجعه کنید:

- [🇬🇧 مستندات پلاگین زبان انگلیسی](../README.md)
- [🇮🇷 مستندات پلاگین زبان فارسی](../docs/persian.md)
- [🇫🇷 مستندات پلاگین زبان فرانسوی](../docs/french.md)
- [🇯🇵 مستندات پلاگین زبان ژاپنی](../docs/japanese.md)
- [🇨🇳 مستندات پلاگین زبان چینی](../docs/chinese.md)
- [🇷🇺 مستندات پلاگین زبان روسی](../docs/russian.md)
- [🇩🇪 مستندات پلاگین زبان آلمانی](../docs/german.md)
- [🇪🇸 مستندات پلاگین زبان اسپانیایی](../docs/spanish.md)

## مجوز

این بسته تحت مجوز MIT منتشر شده است.
