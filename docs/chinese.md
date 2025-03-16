
# Harfizer — 用中文朗读您的数字、日期和时间

**Harfizer** 是一个功能强大的包，用于将数字、日期和时间转换为中文文本。它通过使用语言特定的插件，使您能够轻松地将数值和时间转换为对应的文字表示。  
如果您希望使用其他语言，请点击上方或下方提供的相应文档链接。

## 目录
- [Harfizer — 用中文朗读您的数字、日期和时间](#harfizer--用中文朗读您的数字日期和时间)
  - [目录](#目录)
  - [安装](#安装)
  - [使用方法](#使用方法)
  - [函数](#函数)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [示例](#示例)
  - [附加选项](#附加选项)
  - [其他语言插件文档](#其他语言插件文档)
  - [许可证](#许可证)

## 安装

通过 npm 安装 Harfizer:

```bash
npm install harfizer
```

## 使用方法

从包中导入插件和 `CoreConverter` 类:

```typescript
import { CoreConverter, ChineseLanguagePlugin } from 'harfizer';

const chinesePlugin = new ChineseLanguagePlugin();
const converter = new CoreConverter(chinesePlugin);
```

## 函数

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
将一个数字（整数或小数，可能为负数）转换为中文文本表示。小数部分将逐位转换，并使用“点”来表示小数点。

**参数:**
- **input:** 数字、数字字符串或 bigint。
- **options (可选):** 用于定制转换的对象:
  - `customZeroWord` – 覆盖默认的“零”字。
  - `customNegativeWord` – 覆盖默认的负号（“负”）。
  - `customSeparator` – 覆盖默认的分隔符。

**返回值:**  
表示数字的中文文本字符串。

**示例:**

```typescript
converter.convertNumber("123"); 
// 输出: "一百二十三"

converter.convertNumber("-456.78"); 
// 输出: "负四百五十六 点 七八"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
将一个最多四位的数字转换为中文文本表示（用于处理不超过 10,000 的数字）。

**参数:**
- **num:** 数值（最多 4 位）。

**返回值:**  
表示该数字的中文文本字符串（例如："四百五十六"）。

**示例:**

```typescript
converter.convertTripleToWords(789); 
// 输出: "七百八十九"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
将一个公历日期字符串（格式为 "YYYY/MM/DD" 或 "YYYY-MM-DD"）转换为中文文本表示。输出格式为 "YYYY年MM月DD日"，其中每一部分均转换为中文数字。

**参数:**
- **dateStr:** 日期字符串。
- **calendar (可选):** 对于中文，仅支持公历（默认 "gregorian"）。

**返回值:**  
表示日期的中文文本字符串。

**示例:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// 输出: "二零二三年四月五日"
```

---

### `convertTimeToWords(timeStr: string): string`
将一个时间字符串（格式为 "HH:mm"）转换为中文文本表示。输出格式为 "<hour>时<minute>分"；若分钟为 0，则仅显示 "<hour>时"。

**参数:**
- **timeStr:** 时间字符串（格式 "HH:mm"）。

**返回值:**  
表示时间的中文文本字符串。

**示例:**

```typescript
converter.convertTimeToWords("09:00"); 
// 输出: "九时"

converter.convertTimeToWords("09:05"); 
// 输出: "九时五分"
```

## 示例

以下是使用 `ChineseLanguagePlugin` 和 `CoreConverter` 的示例:

```typescript
import { CoreConverter, ChineseLanguagePlugin } from 'harfizer';

const chinesePlugin = new ChineseLanguagePlugin();
const converter = new CoreConverter(chinesePlugin);

console.log(converter.convertNumber("123")); 
// 输出: "一百二十三"

console.log(converter.convertDateToWords("2023/04/05")); 
// 输出: "二零二三年四月五日"

console.log(converter.convertTimeToWords("09:05")); 
// 输出: "九时五分"
```

## 附加选项

`convertNumber` 方法接受一个可选的 `ConversionOptions` 对象，以定制数字转换:

```typescript
const options = {
  customZeroWord: "零",
  customNegativeWord: "负",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// 输出: "负 一百二十三"
```

## 其他语言插件文档

有关其他语言插件的文档，请参阅以下文件:

- [🇬🇧 英语插件文档](../README.md)
- [🇮🇷 波斯语插件文档](../docs/persian.md)
- [🇫🇷 法语插件文档](../docs/french.md)
- [🇯🇵 日语插件文档](../docs/japanese.md)
- [🇨🇳 中文插件文档](../docs/chinese.md)
- [🇷🇺 俄语插件文档](../docs/russian.md)
- [🇩🇪 德语插件文档](../docs/german.md)
- [🇪🇸 西班牙语插件文档](../docs/spanish.md)

## 许可证

此软件包遵循 MIT 许可证