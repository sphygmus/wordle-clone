import React from "react";

type WordComponentProps = {
	word: string;
	guess: string;
	unfinished: boolean;
}

const WordComponent: React.FC<WordComponentProps> = ({ word, guess, unfinished }) => {
	const letters = [];
	for (let i = 0; i < 5; i++) {
		letters[i] = guess[i] || "";
	}

	return (
		<div className="words-row-container">
			{letters.map((letter, index) => {
				let wordClass = "words-row-item";
				if (letter.length > 0 && !unfinished) {
					if (word.charAt(index) === letter)
						wordClass += " correct";
					else if (word.indexOf(letter) > -1)
						wordClass += " adjacent";
					else
						wordClass += " wrong";
				}

				return <div key={`letter-${index}`} className={wordClass}>{letter}</div>;
			})}
		</div>
	)
}

export default WordComponent;