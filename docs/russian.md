
# Harfizer — Прочитайте ваши числа, даты и время вслух (на любом языке)!

**Harfizer** — это мощный пакет для преобразования чисел, дат и времени в слова. Он использует плагины, специфичные для языка, что позволяет легко преобразовывать числовые и временные значения в их текстовое представление.  
Если вы предпочитаете использовать другой язык, пожалуйста, нажмите на соответствующие ссылки, приведённые выше или в конце этого документа.

## Оглавление
- [Harfizer — Прочитайте ваши числа, даты и время вслух (на любом языке)!](#harfizer--прочитайте-ваши-числа-даты-и-время-вслух-на-любом-языке)
  - [Оглавление](#оглавление)
  - [Установка](#установка)
  - [Использование](#использование)
  - [Функции](#функции)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [Примеры](#примеры)
  - [Дополнительные опции](#дополнительные-опции)
  - [Документация по другим языковым плагинам](#документация-по-другим-языковым-плагинам)
  - [Лицензия](#лицензия)

## Установка

Установите Harfizer через npm:

```bash
npm install harfizer
```

## Использование

Импортируйте плагин и класс `CoreConverter` из пакета:

```typescript
import { CoreConverter, RussianLanguagePlugin } from 'harfizer';

const russianPlugin = new RussianLanguagePlugin();
const converter = new CoreConverter(russianPlugin);
```

## Функции

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
Преобразует заданное число (целое или десятичное, возможно, отрицательное) в текстовую форму на русском языке. Десятичная часть обрабатывается по разрядам с использованием слова "запятая".

**Параметры:**
- **input:** число, числовая строка или bigint.
- **options (необязательно):** объект для настройки преобразования:
  - `customZeroWord` – переопределяет слово для нуля.
  - `customNegativeWord` – переопределяет слово для отрицательных чисел.
  - `customSeparator` – переопределяет разделитель между токенами.

**Возвращаемое значение:**  
Строка, представляющая число словами на русском.

**Пример:**

```typescript
converter.convertNumber("123"); 
// Вывод: "сто двадцать три"

converter.convertNumber("-456.78"); 
// Вывод: "минус четыреста пятьдесят шесть запятая семь восемь"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
Преобразует число до трёх цифр (или меньше) в его текстовую форму на русском языке.

**Параметры:**
- **num:** числовое значение (до 3 цифр).

**Возвращаемое значение:**  
Строка, представляющая данное число словами (например, "четыреста пятьдесят шесть").

**Пример:**

```typescript
converter.convertTripleToWords(789); 
// Вывод: "семьсот восемьдесят девять"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
Преобразует строку даты в формате "YYYY/MM/DD" или "YYYY-MM-DD" в текстовую форму на русском языке. Выходной формат: "день месяц год года", где название месяца берётся на русском.

**Параметры:**
- **dateStr:** строка даты.
- **calendar (необязательно):** для русского используется "gregorian" (по умолчанию).

**Возвращаемое значение:**  
Строка, представляющая дату словами.

**Пример:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// Вывод: "пять апреля две тысячи двадцать третьего года"
```

*Примечание: точное представление может варьироваться в зависимости от реализации.*

---

### `convertTimeToWords(timeStr: string): string`
Преобразует строку времени в формате "HH:mm" в текстовую форму на русском языке.  
Если минуты равны нулю, возвращается, например, "девять часов"; иначе – "девять часов пять минут".

**Параметры:**
- **timeStr:** строка времени в формате "HH:mm".

**Возвращаемое значение:**  
Строка, представляющая время словами.

**Пример:**

```typescript
converter.convertTimeToWords("09:00"); 
// Вывод: "девять часов"

converter.convertTimeToWords("09:05"); 
// Вывод: "девять часов пять минут"
```

## Примеры

Ниже приведён пример использования `RussianLanguagePlugin` с `CoreConverter`:

```typescript
import { CoreConverter, RussianLanguagePlugin } from 'harfizer';

const russianPlugin = new RussianLanguagePlugin();
const converter = new CoreConverter(russianPlugin);

console.log(converter.convertNumber("123")); 
// Вывод: "сто двадцать три"

console.log(converter.convertDateToWords("2023/04/05")); 
// Вывод: "пять апреля две тысячи двадцать третьего года"

console.log(converter.convertTimeToWords("09:05")); 
// Вывод: "девять часов пять минут"
```

## Дополнительные опции

Метод `convertNumber` принимает необязательный объект `ConversionOptions` для настройки преобразования:

```typescript
const options = {
  customZeroWord: "ноль",
  customNegativeWord: "минус",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// Вывод: "минус сто двадцать три"
```

## Документация по другим языковым плагинам

Для получения документации по плагинам на других языках, пожалуйста, обратитесь к следующим файлам:

- [🇬🇧 Документация по EnglishLanguagePlugin](../README.md)
- [🇮🇷 Документация по PersianLanguagePlugin](../docs/persian.md)
- [🇫🇷 Документация по FrenchLanguagePlugin](../docs/french.md)
- [🇯🇵 Документация по JapaneseLanguagePlugin](../docs/japanese.md)
- [🇨🇳 Документация по ChineseLanguagePlugin](../docs/chinese.md)
- [🇩🇪 Документация по GermanLanguagePlugin](../docs/german.md)
- [🇪🇸 Документация по SpanishLanguagePlugin](../docs/spanish.md)

## Лицензия

Этот пакет распространяется под лицензией MIT.