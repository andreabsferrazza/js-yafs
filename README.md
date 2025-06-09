# yafs.js
## Yet Another Fuzzy Search

This is me writing a library to learn and explore the mechanisms of the fuzzy search, subsequence search, the distances of Levenshtein and Hamming and also practice JS.

## Introduction
The `yafs` class provides a set of functions for string manipulation, search, and comparison. It includes algorithms for subsequence matching, Levenshtein and Hamming distance calculations, and other advanced fuzzy matching techniques.
You can combine search results tailored to your needs.

---
## Install
### HTML
```
<script src="https://cdn.jsdelivr.net/gh/andreabsferrazza/yafs.js@latest/yafs.min.js"></script>
```

---
## Distance Matching
### `levenshtein({a, b})`
**Description:** Calculates the Levenshtein distance between two strings, measuring the minimum number of edits needed to transform `a` into `b`.
**Return:** `number`  
- `>= 0` → Distance value.  
- `-1` → Invalid input.  
- `-2` → Empty input strings.  
- Calls `hamming()` if strings are of equal length.
### `hamming({a, b})`
**Description:** Computes the Hamming distance between two strings of equal length by counting differing characters.
**Return:** `number`  
- `>= 0` → Distance value.  
- `-1` → Invalid input.  
- `-2` → Empty input strings.  
- `-3` → Strings have different lengths.
### `search_levenshstein({needle, haystack, threshold, case_sensitive})`
**Description:** Compares `needle` with `haystack`, computing the Levenshtein distance between words and checking similarity based on the `threshold`.
**Return:** `object` with data of the search and a `found` property
- `found = -1` → Error in input.  
- `found = -2` → Error during Levenshtein calculation.  
- `found = 0` → No match.
- `found > 0` → Matches found.
## Inclusion Matching
### `searchIncluded({needle, haystack})`
**Return:** `object` with data of the search and a `found` property
- `found = -1` → Error in input.  
- `found = 0` → No match.
- `found > 0` → Matches found.
**Description:** Checks if `needle` is contained within `haystack`.
### `search_numbers_included({needle, haystack, max_keys})`
**Description:** Searches for numbers contained in `needle` within the words of `haystack`. If a word in `needle` is a number and meets the `max_keys` constraint, it checks for inclusion in `haystack`.  
**Return:** `object` with data of the search and a `found` property
- `found = -1` → Error in input.  
- `found = 0` → No match.
- `found > 0` → Matches found.
## Subsequence Matching
### `create_subsequence_pattern({needle, gaps_allowed})`
**Description:** Creates a regular expression that represents the `needle` string with allowed gaps defined by `gaps_threshold`. This is used in subsequence matching.
### `subsequence_match({needle, haystack, gaps_allowed, case_sensitive})`
**Description:** given a needle determine if all the letters of the needle appears in the same order somewhere in the haystack, ignoring any other characters in between them (defined by gaps_threshold)
**Return:** `number`  
- `1` → Match found.  
- `0` → No match found.  
- `-1` → Invalid input.  
- `-2` → Empty input string.
### `search_subsequence({needle, haystack,gaps_allowed})`
**Description:** Determines whether `needle` appears as a subsequence within `haystack`, ignoring character gaps.  
**Return:** `object` with data of the search and a `found` property
- `found = -1` → Error in input.  
- `found = 0` → No match.
- `found > 0` → Matches found.
**Example**
```
const result = yafs.search_subsequence("abc", "a random text with a b and c inside",999);
console.log(result.found); // 1 (Match found)
```
## Utilities
### `clean({str, case_sensitive})`
**Description:** Removes special characters and normalizes the string.
**Return:** `string` str cleaned
# Search juggling
The `yafs` class allows multiple search techniques to be combined to refine results. For instance:
- Using **Levenshtein distance** along with **subsequence matching** improves search accuracy for partial matches.
- Combining **searchIncluded** with **search_levenshstein** helps identify closely related terms in a text.
- Applying **clean()** before executing searches enhances the quality of results by removing unnecessary characters.
