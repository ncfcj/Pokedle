import {createSlice} from '@reduxjs/toolkit'
import {PokemonData} from "../types/PokemonData";
import {PokemonSpecies} from "../types/PokemonSpecies";
import {GameMode} from "../enums/GameMode";

export const GamePageSlice = createSlice({
    name: 'GamePage',
    initialState: {
        guessedPokemonList : [] as PokemonData[],
        guessInputValue : "" as string,
        totalGuesses : 0 as number,
        targetPokemonData : {} as PokemonData,
        targetPokemonSpecies : {} as PokemonSpecies,
        gameMode : GameMode.Classic as GameMode,
        lives : 0 as number,
        targetPokemonColor: "" as string,
        targetPokemonTypes: [] as string[]
    },
    reducers: {
        resetGame: (state) => {
            state.guessedPokemonList = [] as PokemonData[];
            state.guessInputValue = "";
            state.totalGuesses = 0;
            state.targetPokemonData = {} as PokemonData;
            state.targetPokemonSpecies = {} as PokemonSpecies;
            state.gameMode = GameMode.Classic as GameMode;
            state.lives = 0;
        },
        setTotalGuesses: (state, action) => {
            state.totalGuesses = action.payload;
        },
        setLives: (state, action) => {
            state.lives = action.payload;
        },
        removeLife: (state) => {
            state.lives -= 1
        },
        changeGameModeToLives: (state) => {
            state.gameMode = GameMode.Lives
        },
        changeGameModeToClassic: (state) => {
            state.gameMode = GameMode.Classic
        },
        setNewTargetPokemon: (state, action) => {
            state.targetPokemonData = action.payload;
        },
        setNewTargetPokemonSpecies: (state, action) => {
            state.targetPokemonSpecies = action.payload;
        },
        setGuessInputValue: (state, action) => {
            state.guessInputValue = action.payload;
        },
        addNewGuessedPokemon: (state, action) => {
            state.guessedPokemonList.push(action.payload);
        },
        sortGuessedPokemonList: (state) => {
            state.guessedPokemonList = state.guessedPokemonList.sort((a, b) => {
                const keyA = a.guessNumber;
                const keyB = b.guessNumber;
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
        },
        setTargetPokemonColorAndTypes: (state, action) => {
            const {pokemonColor, pokemonTypes} = action.payload;
            state.targetPokemonTypes = pokemonTypes;
            state.targetPokemonColor = pokemonColor;
        },
    },
})

// Action creators are generated for each case reducer function
export const { removeLife,
    changeGameModeToLives,
    changeGameModeToClassic,
    setNewTargetPokemon,
    setNewTargetPokemonSpecies,
    setGuessInputValue,
    addNewGuessedPokemon,
    sortGuessedPokemonList,
    setLives,
    setTotalGuesses,
    resetGame,
    setTargetPokemonColorAndTypes} = GamePageSlice.actions

export default GamePageSlice.reducer