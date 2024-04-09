import {PokemonData} from "./PokemonData";
import {PokemonSpecies} from "./PokemonSpecies";
import {PokemonJson} from "./PokemonJson";
import {GameMode} from "../enums/GameMode";

export type PokemonGamePageData = {
    GuessLineList : PokemonData[],
    TargetPokemonData : PokemonData,
    GuessInputValue : string,
    TargetPokemonSpecies : PokemonSpecies,
    GuessNumber : number,
    InputDisabled : boolean,
    DialogIsOpen : boolean,
    ResetGame : number,
    LastGuess : string,
    PokemonList : PokemonJson[],
    GameMode : GameMode,
    Lives : number[],
    Render : number,
    AlertOpen : boolean,
    AlertMessage : string,
    EndGameDialogMessage : string,
    EndGameDialogTitle : string
}