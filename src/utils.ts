const WORDS_DATA_URL = "https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt";

const getWords = async () => {
	try {
		const response = await fetch(WORDS_DATA_URL);
		const words_text = await response.text();
		const words = words_text.split("\n");
		return words;
	} catch {
		return <string[]>[];
	}
}

const chooseRandomWord = (words: string[]) => {
	return words[Math.floor(Math.random() * words.length)];
}

enum LetterFoundState {
	None,
	NotFound,
	Adjacent,
	Found
}

type LetterObject = {
	char: string;
	found: LetterFoundState;
}

const createLettersArray = () => {
	const letters = "abcdefghijklmnopqrstuvwxyz";
	const array: LetterObject[] = [];
	for (let i = 0; i < letters.length; i++) {
		array.push({ char: letters.charAt(i), found: LetterFoundState.None })
	}

	return array;
}

export { LetterFoundState, chooseRandomWord, createLettersArray, getWords }
export type { LetterObject }