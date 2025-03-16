
# Harfizer — Lee tus números, fechas y horas en español

**Harfizer** es un paquete potente para convertir números, fechas y horas en texto. Mediante el uso de plugins específicos para cada idioma, Harfizer te permite transformar de forma sencilla valores numéricos y temporales en su representación textual.  
Si prefieres utilizar otro idioma, consulta la documentación correspondiente a través de los enlaces proporcionados arriba o al final de este documento.

## Tabla de Contenidos
- [Harfizer — Lee tus números, fechas y horas en español](#harfizer--lee-tus-números-fechas-y-horas-en-español)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Instalación](#instalación)
  - [Uso](#uso)
  - [Funciones](#funciones)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [Ejemplos](#ejemplos)
  - [Opciones Adicionales](#opciones-adicionales)
  - [Documentación de Otros Plugins Lingüísticos](#documentación-de-otros-plugins-lingüísticos)
  - [Licencia](#licencia)

## Instalación

Instala Harfizer mediante npm:

```bash
npm install harfizer
```

## Uso

Importa el plugin y la clase `CoreConverter` desde el paquete:

```typescript
import { CoreConverter, SpanishLanguagePlugin } from 'harfizer';

const spanishPlugin = new SpanishLanguagePlugin();
const converter = new CoreConverter(spanishPlugin);
```

## Funciones

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
Convierte un número (entero o decimal, que puede ser negativo) a su representación textual en español. La parte decimal se procesa dígito por dígito usando la palabra "punto".

**Parámetros:**
- **input:** Número, cadena numérica o bigint.
- **options (opcional):** Objeto para personalizar la conversión:
  - `customZeroWord` – Sobrescribe la palabra por defecto para cero.
  - `customNegativeWord` – Sobrescribe la palabra por defecto para números negativos.
  - `customSeparator` – Sobrescribe el separador por defecto entre grupos.

**Valor de retorno:**  
Una cadena que representa el número en palabras.

**Ejemplo:**

```typescript
converter.convertNumber("123"); 
// Salida: "cien veintitrés"

converter.convertNumber("-456.78"); 
// Salida: "menos cuatrocientos cincuenta y seis punto siete ocho"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
Convierte un número de hasta tres dígitos en su representación textual en español.

**Parámetros:**
- **num:** Valor numérico (hasta 3 dígitos).

**Valor de retorno:**  
Una cadena que representa el número en palabras (por ejemplo, "cuatrocientos cincuenta y seis").

**Ejemplo:**

```typescript
converter.convertTripleToWords(789); 
// Salida: "setecientos ochenta y nueve"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
Convierte una cadena de fecha en formato "YYYY/MM/DD" o "YYYY-MM-DD" en su representación textual en español. La salida se formatea como "día de mes de año".

**Parámetros:**
- **dateStr:** Cadena de fecha.
- **calendar (opcional):** Para español se utiliza el calendario gregoriano (valor por defecto "gregorian").

**Valor de retorno:**  
Una cadena que representa la fecha en palabras.

**Ejemplo:**

```typescript
converter.convertDateToWords("2023/04/05"); 
// Salida: "cinco de abril de dos mil veintitrés"
```

---

### `convertTimeToWords(timeStr: string): string`
Convierte una cadena de tiempo en formato "HH:mm" en su representación textual en español.  
Si los minutos son cero, devuelve por ejemplo "Es la una en punto"; de lo contrario, devuelve "Son las [hora] y [minutos] minutos".

**Parámetros:**
- **timeStr:** Cadena de tiempo (formato "HH:mm").

**Valor de retorno:**  
Una cadena que representa la hora en palabras.

**Ejemplo:**

```typescript
converter.convertTimeToWords("09:00"); 
// Salida: "Son las nueve en punto"

converter.convertTimeToWords("09:05"); 
// Salida: "Son las nueve y cinco minutos"
```

## Ejemplos

A continuación se muestra un ejemplo del uso de `SpanishLanguagePlugin` junto con `CoreConverter`:

```typescript
import { CoreConverter, SpanishLanguagePlugin } from 'harfizer';

const spanishPlugin = new SpanishLanguagePlugin();
const converter = new CoreConverter(spanishPlugin);

console.log(converter.convertNumber("123")); 
// Salida: "cien veintitrés"

console.log(converter.convertDateToWords("2023/04/05")); 
// Salida: "cinco de abril de dos mil veintitrés"

console.log(converter.convertTimeToWords("09:05")); 
// Salida: "Son las nueve y cinco minutos"
```

## Opciones Adicionales

El método `convertNumber` acepta un objeto opcional `ConversionOptions` para personalizar la conversión:

```typescript
const options = {
  customZeroWord: "cero",
  customNegativeWord: "menos",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// Salida: "menos cien veintitrés"
```

## Documentación de Otros Plugins Lingüísticos

Para consultar la documentación de otros plugins, por favor refiérase a los siguientes archivos:

- [🇬🇧 Documentación del plugin en inglés](../README.md)
- [🇮🇷 Documentación del plugin en persa](../docs/persian.md)
- [🇫🇷 Documentación del plugin en francés](../docs/french.md)
- [🇯🇵 Documentación del plugin en japonés](../docs/japanese.md)
- [🇨🇳 Documentación del plugin en chino](../docs/chinese.md)
- [🇷🇺 Documentación del plugin en ruso](../docs/russian.md)
- [🇩🇪 Documentación del plugin en alemán](../docs/german.md)

## Licencia

Este paquete se distribuye bajo la licencia MIT.
