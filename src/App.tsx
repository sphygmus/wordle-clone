import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import Icon from "@mdi/react";
import { mdiReload } from '@mdi/js'

import WordComponent from "./components/WordComponent";
import { chooseRandomWord, createLettersArray, getWords, LetterFoundState } from "./utils";
import FoundLetters from "./components/FoundLetters";

enum GameState {
	Playing,
	Lost,
	Won
}

const App: React.FC = () => {
	const [words, setWords] = useState<string[]>([]);
	const [chosenWord, setChosenWord] = useState("loser");

	const [guesses, setGuesses] = useState<string[]>([]);
	const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
	const [gameState, setGameState] = useState(GameState.Playing);

	const [letters, setLetters] = useState(createLettersArray());

	const resetGuesses = (init: boolean = false) => {
		setGuesses(Array(6).fill(""));
		if (!init) {
			setCurrentGuessIndex(0);
			setGameState(GameState.Playing);
			setChosenWord(chooseRandomWord(words));
			setLetters(createLettersArray());
		}
	}

	useEffect(() => {
		const getAllWords = async () => {
			const allWords = await getWords();
			setWords(allWords);
			resetGuesses(true);

			const randomWord = chooseRandomWord(allWords);
			setChosenWord(randomWord);
			console.log(randomWord)
		}

		getAllWords();

		document.addEventListener("click", () => {
			const inputElem = document.getElementById("mobile-input") as HTMLInputElement;
			if (inputElem) {
				inputElem.focus();
			}
		}, false);
	}, []);

	const refreshGame = () => {
		resetGuesses();
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isMobile)
			document.dispatchEvent(new KeyboardEvent("keydown", { "key": e.currentTarget.value }));
	}

	useEffect(() => {
		const onKeyPressed = (e: KeyboardEvent) => {
			if (gameState !== GameState.Playing)
				return;

			if (e.key === "Enter") {
				if (guesses[currentGuessIndex].length >= 5) {
					if (!words.includes(guesses[currentGuessIndex]))
						return;

					if (guesses[currentGuessIndex] === chosenWord)
						setGameState(GameState.Won);
					else if (guesses[guesses.length - 1].length > 0)
						setGameState(GameState.Lost);

					let newLetters = [...letters];
					for (let i = 0; i < guesses[currentGuessIndex].length; i++) {
						const currentChar = guesses[currentGuessIndex].charAt(i);
						if (newLetters.filter(letter => currentChar === letter.char && letter.found === LetterFoundState.Found).length > 0)
							continue;

						let foundState = LetterFoundState.None;
						const index = newLetters.findIndex(letter => letter.char === currentChar);

						if (chosenWord.charAt(i) === guesses[currentGuessIndex].charAt(i))
							foundState = LetterFoundState.Found;
						else if (chosenWord.includes(currentChar))
							foundState = LetterFoundState.Adjacent;
						else
							foundState = LetterFoundState.NotFound;

						newLetters[index].found = foundState;
					}

					setCurrentGuessIndex(current => current + 1);
				}

				return;
			} else if (e.key === "Backspace") {
				if (guesses[currentGuessIndex].length > 0) {
					let updatedGuesses = [...guesses];
					updatedGuesses[currentGuessIndex] = updatedGuesses[currentGuessIndex].slice(0, -1);
					setGuesses(updatedGuesses);
				}

				return;
			}

			const keyLower = e.key.toLowerCase();
			if (keyLower.match(/^[a-z]{1}$/)) {
				if (guesses[currentGuessIndex].length < 5) {
					let updatedGuesses = [...guesses];
					updatedGuesses[currentGuessIndex] += keyLower;
					setGuesses(updatedGuesses);
				}
			}
		}

		document.addEventListener("keydown", onKeyPressed, false);
		return () => {
			document.removeEventListener("keydown", onKeyPressed, false);
		}
	}, [currentGuessIndex, gameState, guesses, letters]);

	const GameOverMessage = () => useMemo(() => {
		const gameWon = gameState === GameState.Won;
		return <span>You {gameWon ? "won!" : "lost."} The correct word was: <span className={gameWon ? "won" : "lost"}>{chosenWord}</span>.</span>;
	}, [gameState]);

	return (
		<div className="container">
			<div className="words">
				{
					guesses.map((guess, index) => (
						<WordComponent
							key={`word-${chosenWord.charAt(index)}-${index}`}
							word={chosenWord}
							guess={guess}
							unfinished={index === currentGuessIndex}
						/>
					))
				}
			</div>
			{gameState !== GameState.Playing &&
				<div className="game-over">
					<GameOverMessage />
					<span className="info">To restart the game, click the reload button on the top left.</span>
				</div>
			}
			<div className="left-bar">
				<button className="reload-button" onClick={refreshGame}><Icon vertical horizontal path={mdiReload} size={1} color="white" /></button>
				<FoundLetters letters={letters} />
			</div>
			<input autoCapitalize="off" id="mobile-input" autoComplete="off" onChange={handleInput} value="" />
		</div>
	)
}

export default App;