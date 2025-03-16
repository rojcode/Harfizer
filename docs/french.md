
# Harfizer — Lisez vos nombres, dates et heures à haute voix en français

**Harfizer** est un puissant package qui convertit les nombres, les dates et les heures en texte. Grâce à l'utilisation de plugins spécifiques à chaque langue, Harfizer vous permet de transformer facilement des valeurs numériques et temporelles en leur représentation textuelle.  
Si vous préférez utiliser une autre langue, veuillez cliquer sur les liens correspondants ci-dessus ou en bas de ce document.

## Table des matières
- [Harfizer — Lisez vos nombres, dates et heures à haute voix en français](#harfizer--lisez-vos-nombres-dates-et-heures-à-haute-voix-en-français)
  - [Table des matières](#table-des-matières)
  - [Installation](#installation)
  - [Utilisation](#utilisation)
  - [Fonctions](#fonctions)
    - [`convertNumber(input: InputNumber, options?: ConversionOptions): string`](#convertnumberinput-inputnumber-options-conversionoptions-string)
    - [`convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`](#converttripletowordsnum-inputnumber-lexicon-any-_separator-string-string)
    - [`convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`](#convertdatetowordsdatestr-string-calendar-jalali--gregorian-string)
    - [`convertTimeToWords(timeStr: string): string`](#converttimetowordstimestr-string-string)
  - [Exemples](#exemples)
  - [Options supplémentaires](#options-supplémentaires)
  - [Documentation des autres plugins linguistiques](#documentation-des-autres-plugins-linguistiques)
  - [Licence](#licence)

## Installation

Installez Harfizer via npm :

```bash
npm install harfizer
```

## Utilisation

Importez le plugin et la classe `CoreConverter` depuis le package :

```typescript
import { CoreConverter, FrenchLanguagePlugin } from 'harfizer';

const frenchPlugin = new FrenchLanguagePlugin();
const converter = new CoreConverter(frenchPlugin);
```

## Fonctions

### `convertNumber(input: InputNumber, options?: ConversionOptions): string`
Convertit un nombre (entier ou décimal, éventuellement négatif) en sa représentation textuelle en français. La partie décimale est traitée chiffre par chiffre avec le mot "virgule".

**Paramètres :**
- **input :** un nombre, une chaîne numérique ou un bigint.
- **options (facultatif) :** un objet pour personnaliser la conversion :
  - `customZeroWord` – remplace le mot par défaut pour zéro.
  - `customNegativeWord` – remplace le mot par défaut pour les nombres négatifs.
  - `customSeparator` – remplace le séparateur par défaut entre les groupes.

**Retour :**  
Une chaîne représentant le nombre en toutes lettres.

**Exemple :**

```typescript
converter.convertNumber("123"); 
// Sortie : "cent vingt-trois"

converter.convertNumber("-456.78"); 
// Sortie : "moins quatre cent cinquante-six virgule sept huit"
```

---

### `convertTripleToWords(num: InputNumber, lexicon?: any, _separator?: string): string`
Convertit un nombre à trois chiffres (ou moins) en sa représentation textuelle en français.

**Paramètres :**
- **num :** une valeur numérique (jusqu’à 3 chiffres).

**Retour :**  
Une chaîne représentant le nombre en toutes lettres (ex. "quatre cent cinquante-six").

**Exemple :**

```typescript
converter.convertTripleToWords(789); 
// Sortie : "sept cent quatre-vingt-neuf"
```

---

### `convertDateToWords(dateStr: string, calendar?: "jalali" | "gregorian"): string`
Convertit une chaîne de date (au format "YYYY/MM/DD" ou "YYYY-MM-DD") en sa représentation textuelle en français. Le format de sortie est "jour mois année" (par exemple, "premier avril deux mille vingt-trois").

**Paramètres :**
- **dateStr :** la chaîne de date.
- **calendar (facultatif) :** pour le français, utilisez "gregorian" (par défaut).

**Retour :**  
Une chaîne représentant la date en toutes lettres.

**Exemple :**

```typescript
converter.convertDateToWords("2023/04/05"); 
// Sortie : "premier avril deux mille vingt-trois"
```

---

### `convertTimeToWords(timeStr: string): string`
Convertit une chaîne de temps (au format "HH:mm") en sa représentation textuelle en français.  
Si les minutes sont égales à zéro, retourne par exemple "Il est neuf heures" ; sinon, "Il est neuf heures cinq minutes".

**Paramètres :**
- **timeStr :** une chaîne de temps au format "HH:mm".

**Retour :**  
Une chaîne représentant le temps en toutes lettres.

**Exemple :**

```typescript
converter.convertTimeToWords("09:00"); 
// Sortie : "Il est neuf heures"

converter.convertTimeToWords("09:05"); 
// Sortie : "Il est neuf heures cinq minutes"
```

## Exemples

Voici un exemple d'utilisation du `FrenchLanguagePlugin` avec `CoreConverter` :

```typescript
import { CoreConverter, FrenchLanguagePlugin } from 'harfizer';

const frenchPlugin = new FrenchLanguagePlugin();
const converter = new CoreConverter(frenchPlugin);

console.log(converter.convertNumber("123")); 
// Sortie : "cent vingt-trois"

console.log(converter.convertDateToWords("2023/04/05")); 
// Sortie : "premier avril deux mille vingt-trois"

console.log(converter.convertTimeToWords("09:05")); 
// Sortie : "Il est neuf heures cinq minutes"
```

## Options supplémentaires

La méthode `convertNumber` accepte un objet optionnel `ConversionOptions` pour personnaliser la conversion :

```typescript
const options = {
  customZeroWord: "zéro",
  customNegativeWord: "moins",
  customSeparator: " "
};

console.log(converter.convertNumber("-123", options)); 
// Sortie : "moins cent vingt-trois"
```

## Documentation des autres plugins linguistiques

Pour consulter la documentation des autres plugins, veuillez vous référer aux fichiers suivants :

- [🇬🇧 Documentation du plugin anglais](../README.md)
- [🇮🇷 Documentation du plugin persan](../docs/persian.md)
- [🇫🇷 Documentation du plugin français](../docs/french.md)
- [🇯🇵 Documentation du plugin japonais](../docs/japanese.md)
- [🇨🇳 Documentation du plugin chinois](../docs/chinese.md)
- [🇷🇺 Documentation du plugin russe](../docs/russian.md)
- [🇩🇪 Documentation du plugin allemand](../docs/german.md)
- [🇪🇸 Documentation du plugin espagnol](../docs/spanish.md)

## Licence

Ce package est distribué sous la licence MIT.
