from string import ascii_lowercase
from pprint import pprint

def read_text(filepath: str) -> str:
	with open(filepath, 'r', encoding='UTF-8') as f:
		raw_text = f.read()
		raw_text.replace('\n', '')
		raw_text.replace('\t', '')
		raw_text.replace(' ', '')
		raw_text.strip()
		raw_text.lower()

		allowed_chars = ascii_lowercase

		text = ''
		for char in raw_text:
			if char in allowed_chars:
				text += char
		return text


def static_analyze_text(text: str) -> tuple[dict, dict, dict, dict]:
	text_length = len(text)
	char_counts = {}

	for char in text:
		char_counts[char] = char_counts.get(char, 0) + 1

	char_frequency = {}
	for key in char_counts:
		char_frequency[key] = char_counts.get(key, 0) / text_length

	pair_counts = {}
	for i in range(len(text) - 1):
		pair = text[i:i + 2]
		pair_counts[pair] = pair_counts.get(pair, 0) + 1

	pair_frequency = {}
	for key in pair_counts:
		pair_frequency[key] = pair_counts.get(key, 0) / text_length

	return char_frequency, pair_frequency, char_counts, pair_counts


text = read_text('text.txt')
text = text[:16000]
pprint(static_analyze_text(text))
