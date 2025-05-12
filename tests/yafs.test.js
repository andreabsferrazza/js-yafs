const yafs = require('../yafs');

describe('yafs utility functions', () => {
	test('levenshtein should return correct distance', () => {
		expect(yafs.levenshtein('kitten', 'sitting')).toBe(3);
		expect(yafs.levenshtein('abc', 'abc')).toBe(0);
		expect(yafs.levenshtein('abc', 'def')).toBe(3);
	});
	test('wrong inputs levenshtein', () => {
		expect(yafs.levenshtein('', 'def')).toBe(-2);
		expect(yafs.levenshtein('abc', '')).toBe(-2);
		expect(yafs.levenshtein('', '')).toBe(-2);
		expect(yafs.levenshtein(1, '')).toBe(-1);
	});

	test('hamming should return correct distance', () => {
		expect(yafs.hamming('1011101', '1001001')).toBe(2);
		expect(yafs.hamming('abc', 'abc')).toBe(0);
	});
	test('wrong inputs hamming', () => {
		expect(yafs.hamming('', 'def')).toBe(-2);
		expect(yafs.hamming('abc', '')).toBe(-2);
		expect(yafs.hamming('', '')).toBe(-2);
		expect(yafs.hamming(1, '')).toBe(-1);
	});
	test('clean should remove special characters', () => {
		expect(yafs.clean("Ciao, World!")).toBe("Ciao World");
		expect(yafs.clean("  Ciao   World  ")).toBe("Ciao World");
	});

	test('searchIncluded should find substring occurrences', () => {
		const result = yafs.searchIncluded({needle:"tes", haystack:"this is a test case"});
		expect(result.found).toBeGreaterThan(0);
	});

	test('search_numbers_included should detect numbers in text', () => {
		const result = yafs.search_numbers_included({needle:"123", haystack:"The code 1234 is here"});
		expect(result.found).toBeGreaterThan(0);
	});


	test('subsequence_match should correctly identify matches', () => {
		expect(yafs.subsequence_match({needle:'abc', haystack:'axbycz'})).toBe(1);
		expect(yafs.subsequence_match({needle:'', haystack:'xyz', gaps_allowed:1})).toBe(0);
		expect(yafs.subsequence_match({needle:'abc', haystack:'a98dj92jdlBbycz', gaps_allowed:999})).toBe(1);
		expect(yafs.subsequence_match({needle:'abc', haystack:'xyz', gaps_allowed:1})).toBe(0);
	});
	test('wrong inputs subsequence_match', () => {
		expect(yafs.subsequence_match({needle:2, haystack:'xyz', gaps_allowed:1})).toBe(-1);
		expect(yafs.subsequence_match({needle:'abc', haystack:'xyz', gaps_allowed:"1"})).toBe(-1);
	});
	test('search_subsequence should find valid subsequences', () => {
		const result = yafs.search_subsequence({needle:"abc", haystack:"a random text with a b and c inside",gaps_allowed:999});
		expect(result.found).toBe(1);
		expect(yafs.search_subsequence({needle:'', haystack:'xyz', gaps_allowed:1}).found).toBe(0);
	});
	test('wrong inputs on search_subsequence', () => {
		expect(yafs.search_subsequence({needle:2, haystack:'xyz', gaps_allowed:1}).found).toBe(-1);
		expect(yafs.search_subsequence({needle:'abc', haystack:'xyz', gaps_allowed:"1"}).found).toBe(-1);
	});
});

