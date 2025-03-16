
# Harfizer — 日本語で数字、日付、時刻を読み上げる

**Harfizer** は、数字、日付、時刻をテキストに変換するための強力なパッケージです。言語固有のプラグインを利用することで、数値や時間を対応する文章表現に簡単に変換できます。  
もし他の言語をご希望の場合は、上記または下部にある各言語のドキュメントリンクをご確認ください。

## 目次
- [Harfizer — 日本語で数字、日付、時刻を読み上げる](#harfizer--日本語で数字日付時刻を読み上げる)
  - [目次](#目次)
  - [インストール](#インストール)
  - [使用方法](#使用方法)
  - [関数](#関数)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [例](#例)
  - [追加オプション](#追加オプション)
  - [他の言語プラグインのドキュメント](#他の言語プラグインのドキュメント)
  - [ライセンス](#ライセンス)

## インストール

npm を使用して Harfizer をインストールしてください:

```bash
npm install harfizer
```

## 使用方法

パッケージからプラグインと `CoreConverter` クラスをインポートします:

```typescript
import { CoreConverter, JapaneseLanguagePlugin } from 'harfizer';

const japanesePlugin = new JapaneseLanguagePlugin();
const converter = new CoreConverter(japanesePlugin);
```

## 関数

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
指定された数字（整数または小数、負の数も含む）を日本語のテキスト表現に変換します。小数部分は「点」を使って一桁ずつ読み上げられます。

**パラメーター:**
- **input:** 数字、数字文字列、または bigint。
- **options (オプション):** 変換をカスタマイズするためのオブジェクト:
  - `customZeroWord` – デフォルトの「零」を上書きします。
  - `customNegativeWord` – デフォルトの「マイナス」を上書きします。
  - `customSeparator` – トークン間のデフォルトの区切り文字を上書きします。

**返り値:**  
数字の日本語テキスト表現の文字列。

**例:**

```typescript
converter.convertNumber("123"); 
// 出力: "百二十三"

converter.convertNumber("-456.78"); 
// 出力: "マイナス 四百五十六 点 七八"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
4桁以下の数字を日本語のテキスト表現に変換します（10,000未満の数値を処理するために使用）。

**パラメーター:**
- **num:** 最大4桁の数値。

**返り値:**  
その数字の日本語テキスト表現の文字列（例："四百五十六"）。

**例:**

```typescript
converter.convertTripleToWords(789); 
// 出力: "七百八十九"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
公暦の日付文字列（"YYYY/MM/DD" または "YYYY-MM-DD" 形式）を日本語のテキスト表現に変換します。出力形式は「YYYY年MM月DD日」で、各部分は日本語の数字に変換されます。

**パラメーター:**
- **dateStr:** 日付文字列。
- **calendar (オプション):** 日本語では公暦のみサポートされます（デフォルトは "gregorian"）。

**返り値:**  
日付の日本語テキスト表現の文字列。

**例:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// 出力: "二零二三年四月五日"
```

---

### `convertTimeToWords(timeStr: string): string`
時間文字列（"HH:mm" 形式）を日本語のテキスト表現に変換します。出力形式は「<hour>時<minute>分」です。分が 0 の場合は「<hour>時」のみが返されます。

**パラメーター:**
- **timeStr:** "HH:mm" 形式の時間文字列。

**返り値:**  
時間の日本語テキスト表現の文字列。

**例:**

```typescript
converter.convertTimeToWords("09:00"); 
// 出力: "九時"

converter.convertTimeToWords("09:05"); 
// 出力: "九時五分"
```

## 例

以下は `JapaneseLanguagePlugin` と `CoreConverter` を使用した例です:

```typescript
import { CoreConverter, JapaneseLanguagePlugin } from 'harfizer';

const japanesePlugin = new JapaneseLanguagePlugin();
const converter = new CoreConverter(japanesePlugin);

console.log(converter.convertNumber("123")); 
// 出力: "百二十三"

console.log(converter.convertDateToWords("2023/04/05")); 
// 出力: "二零二三年四月五日"

console.log(converter.convertTimeToWords("09:05")); 
// 出力: "九時五分"
```

## 追加オプション

`convertNumber` メソッドは、変換をカスタマイズするためにオプションの `ConversionOptions` オブジェクトを受け取ります:

```typescript
const options = {
  customZeroWord: "零",
  customNegativeWord: "マイナス",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// 出力: "マイナス 百二十三"
```

## 他の言語プラグインのドキュメント

他の言語プラグインのドキュメントについては、以下のファイルを参照してください:

- [🇬🇧 英語プラグインのドキュメント](../README.md)
- [🇮🇷 波斯語プラグインのドキュメント](../docs/persian.md)
- [🇫🇷 フランス語プラグインのドキュメント](../docs/french.md)
- [🇯🇵 日本語プラグインのドキュメント](../docs/japanese.md)
- [🇨🇳 中国語プラグインのドキュメント](../docs/chinese.md)
- [🇷🇺 ロシア語プラグインのドキュメント](../docs/russian.md)
- [🇩🇪 ドイツ語プラグインのドキュメント](../docs/german.md)
- [🇪🇸 スペイン語プラグインのドキュメント](../docs/spanish.md)

## ライセンス

このパッケージは MIT ライセンスの下で公開されています。
