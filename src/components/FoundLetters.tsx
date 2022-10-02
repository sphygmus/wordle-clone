import React from "react";
import { LetterFoundState } from "../utils";
import type { LetterObject } from "../utils";

type FoundLettersProps = {
	letters: LetterObject[]
}

const FoundLetters: React.FC<FoundLettersProps> = ({ letters }) => {
	return (
		<div className="found-letters-box">
			{letters.map(letter => {
				let letterClasses = "found-letters-item";
				if (letter.found !== LetterFoundState.None) {
					if (letter.found === LetterFoundState.Found)
						letterClasses += " found";
					else if (letter.found === LetterFoundState.Adjacent)
						letterClasses += " adjacent";
					else
						letterClasses += " not-found";
				}

				return (
					<span className={letterClasses}>{letter.char.toUpperCase()}</span>
				)
			})}
		</div>
	)
}

export default FoundLetters;