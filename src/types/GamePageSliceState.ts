import {PokemonData} from "./PokemonData";
import {PokemonSpecies} from "./PokemonSpecies";
import {GameMode} from "../enums/GameMode";

export interface GamePageSliceState {
    GamePage : GamePageInitialState
}

interface GamePageInitialState {
    guessedPokemonList : PokemonData[],
    guessInputValue : string,
    totalGuesses : number,
    targetPokemonData : PokemonData,
    targetPokemonSpecies : PokemonSpecies,
    gameMode : GameMode,
    lives : number,
    targetPokemonTypes: string[],
    targetPokemonColor: ""
}