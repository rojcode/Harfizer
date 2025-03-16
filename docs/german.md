
# Harfizer — Lassen Sie Ihre Zahlen, Daten und Zeiten auf Deutsch vorlesen

**Harfizer** ist ein leistungsstarkes Paket zur Umwandlung von Zahlen, Daten und Zeiten in Text. Durch den Einsatz sprachspezifischer Plugins können numerische und zeitliche Werte mühelos in ihre textuelle Darstellung übersetzt werden.  
Wenn Sie lieber eine andere Sprache verwenden möchten, klicken Sie bitte oben oder unten auf den entsprechenden Dokumentationslink.

## Inhaltsverzeichnis
- [Harfizer — Lassen Sie Ihre Zahlen, Daten und Zeiten auf Deutsch vorlesen](#harfizer--lassen-sie-ihre-zahlen-daten-und-zeiten-auf-deutsch-vorlesen)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Installation](#installation)
  - [Verwendung](#verwendung)
  - [Funktionen](#funktionen)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [Beispiele](#beispiele)
  - [Zusätzliche Optionen](#zusätzliche-optionen)
  - [Dokumentation der anderen Sprachplugins](#dokumentation-der-anderen-sprachplugins)
  - [Lizenz](#lizenz)

## Installation

Installieren Sie Harfizer via npm:

```bash
npm install harfizer
```

## Verwendung

Importieren Sie das Plugin und die Klasse `CoreConverter` aus dem Paket:

```typescript
import { CoreConverter, GermanLanguagePlugin } from 'harfizer';

const germanPlugin = new GermanLanguagePlugin();
const converter = new CoreConverter(germanPlugin);
```

## Funktionen

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
Konvertiert eine gegebene Zahl (ganzzahlig oder dezimal, ggf. negativ) in ihre deutsche Textform. Der Dezimalteil wird dabei Ziffer für Ziffer gelesen, wobei das Wort "Komma" verwendet wird.

**Parameter:**
- **input:** Eine Zahl, eine numerische Zeichenkette oder ein bigint.
- **options (optional):** Ein Objekt zur Anpassung der Konvertierung:
  - `customZeroWord` – Überschreibt das Standardwort für Null.
  - `customNegativeWord` – Überschreibt das Standardwort für negative Zahlen.
  - `customSeparator` – Überschreibt den Standard-Trenner zwischen den Elementen.

**Rückgabewert:**  
Eine Zeichenkette, die die Zahl in Worten darstellt.

**Beispiel:**

```typescript
converter.convertNumber("123"); 
// Ausgabe: "einhundertdreiundzwanzig"

converter.convertNumber("-456.78"); 
// Ausgabe: "minus vierhundertsechsundfünfzig Komma sieben acht"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
Konvertiert eine Zahl mit bis zu drei Ziffern in ihre deutsche Textform.

**Parameter:**
- **num:** Ein numerischer Wert (bis zu 3 Ziffern).

**Rückgabewert:**  
Eine Zeichenkette, die die Zahl in Worten darstellt (z. B. "vierhundertsechsundfünfzig").

**Beispiel:**

```typescript
converter.convertTripleToWords(789); 
// Ausgabe: "siebenhundertneunundachtzig"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
Konvertiert eine Datumszeichenkette im Format "YYYY/MM/DD" oder "YYYY-MM-DD" in ihre deutsche Textdarstellung. Das Format lautet "Monat Tag, Jahr" (z. B. "April 5, two thousand twenty-three").

**Parameter:**
- **dateStr:** Die Datumszeichenkette.
- **calendar (optional):** Für Deutsch wird "gregorian" verwendet (Standard ist "gregorian").

**Rückgabewert:**  
Eine Zeichenkette, die das Datum in Worten darstellt.

**Beispiel:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// Ausgabe: "April 5, two thousand twenty-three"
```

---

### `convertTimeToWords(timeStr: string): string`
Konvertiert eine Zeitzeichenkette im Format "HH:mm" in ihre deutsche Textdarstellung.  
Sind die Minuten null, wird z. B. "Es ist neun Uhr" zurückgegeben, ansonsten "Es ist neun Uhr und fünf Minuten".

**Parameter:**
- **timeStr:** Eine Zeitzeichenkette im Format "HH:mm".

**Rückgabewert:**  
Eine Zeichenkette, die die Zeit in Worten darstellt.

**Beispiel:**

```typescript
converter.convertTimeToWords("09:00"); 
// Ausgabe: "Es ist neun Uhr"

converter.convertTimeToWords("09:05"); 
// Ausgabe: "Es ist neun Uhr und fünf Minuten"
```

## Beispiele

Hier ein Beispiel für die Verwendung des `GermanLanguagePlugin` zusammen mit `CoreConverter`:

```typescript
import { CoreConverter, GermanLanguagePlugin } from 'harfizer';

const germanPlugin = new GermanLanguagePlugin();
const converter = new CoreConverter(germanPlugin);

console.log(converter.convertNumber("123")); 
// Ausgabe: "einhundertdreiundzwanzig"

console.log(converter.convertDateToWords("2023/04/05")); 
// Ausgabe: "April 5, two thousand twenty-three"

console.log(converter.convertTimeToWords("09:05")); 
// Ausgabe: "Es ist neun Uhr und fünf Minuten"
```

## Zusätzliche Optionen

Die Methode `convertNumber` akzeptiert ein optionales `ConversionOptions`-Objekt zur individuellen Anpassung der Konvertierung:

```typescript
const options = {
  customZeroWord: "null",
  customNegativeWord: "minus",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// Ausgabe: "minus einhundertdreiundzwanzig"
```

## Dokumentation der anderen Sprachplugins

Für die Dokumentation zu anderen Sprachplugins konsultieren Sie bitte folgende Dateien:

- [🇬🇧 Dokumentation des EnglishLanguagePlugin](../README.md)
- [🇮🇷 Dokumentation des PersianLanguagePlugin](../docs/persian.md)
- [🇫🇷 Dokumentation des FrenchLanguagePlugin](../docs/french.md)
- [🇯🇵 Dokumentation des JapaneseLanguagePlugin](../docs/japanese.md)
- [🇨🇳 Dokumentation des ChineseLanguagePlugin](../docs/chinese.md)
- [🇷🇺 Dokumentation des RussianLanguagePlugin](../docs/russian.md)
- [🇪🇸 Dokumentation des SpanishLanguagePlugin](../docs/spanish.md)

## Lizenz

Dieses Paket wird unter der MIT-Lizenz vertrieben.
