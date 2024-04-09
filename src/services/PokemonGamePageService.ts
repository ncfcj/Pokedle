import {GameMode} from "../enums/GameMode";
import {PokemonData} from "../types/PokemonData";
import {PokemonSpecies} from "../types/PokemonSpecies";
import {PokemonDataService} from "./PokemonDataService";
import {StringHelper} from "../helpers/StringHelper";

export class PokemonGamePageService {
    // Guess data
    private guessedPokemonList : PokemonData[] = [];
    private guessInputValue : string = "";
    private totalGuesses : number = 0;

    // Target pokemon data
    private targetPokemonData : PokemonData = {} as PokemonData;
    private targetPokemonSpecies : PokemonSpecies = {} as PokemonSpecies;

    // Game control
    private gameMode : GameMode = GameMode.Classic;
    private lives : number = 0;

    // Pokemon data
    private pokemonDataService : PokemonDataService = new PokemonDataService();

    // Component control
    private inputDisabled : boolean = false;
    private dialogIsOpen : boolean = false;
    private alertOpen : boolean = false;
    private alertMessage : string = "";
    private endGameDialogTitle : string = "";
    private endGameDialogMessage : string = "";

    public SetupGamePage = async (gameMode : GameMode) => {
        this.targetPokemonData = this.pokemonDataService.RetrieveNewPokemon();
        this.targetPokemonSpecies = await this.pokemonDataService.RetrievePokemonSpeciesAsync(this.targetPokemonData.id);

        if (gameMode === GameMode.Lives) {
            this.lives = 5;
            this.gameMode = GameMode.Lives;
        }
    }

    public RemoveLife = () => this.lives--;

    public CheckGameMode = () : GameMode => this.gameMode;

    public static PokemonAlreadyGuessed = (guessedPokemonList : PokemonData[], pokemon : PokemonData) : void => {
        const pokemonFound = guessedPokemonList
            .find(guessedPokemon => guessedPokemon.name == pokemon.name);

        if (pokemonFound != undefined)
            throw new Error("You already guessed this pokemon!");
    }

    public SortGuessedPokemonList = () : void => {
        this.guessedPokemonList.sort((a, b) => {
            const keyA = a.guessNumber;
            const keyB = b.guessNumber;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
    }

    public static PokemonGuessedCorrectly = (targetPokemonName: string, pokemonName : string) : boolean => {
        return targetPokemonName.toUpperCase() === pokemonName.toUpperCase();
    }

    public EndGame = () => {
        this.endGameDialogTitle = "Congratulations!";
        this.endGameDialogMessage = `You have guessed ${this.targetPokemonData.name} in ${this.totalGuesses} tries!`;
        this.dialogIsOpen = true;
        this.inputDisabled = true;
        this.totalGuesses = 0;
    }

    public GameLost = () => {
        this.endGameDialogTitle = "Too Bad!";
        this.endGameDialogMessage = `The pokemon was ${this.targetPokemonData.name}!`;
        this.dialogIsOpen = true;
        this.inputDisabled = true;
        this.totalGuesses = 0;
    }

    public GetTargetPokemonTypes = () : string[] => this.targetPokemonData.types;

    public GetTargetPokemonColor = () : string => StringHelper.CapitalizeFirstLetter(this.targetPokemonSpecies.color?.name);

    public GetLives = () : number => this.lives;

    public GetGameMode = () : GameMode => this.gameMode;

    public GetGuessedPokemonList = () : PokemonData[] => this.guessedPokemonList;

    public GetTargetPokemonData = () : PokemonData => this.targetPokemonData;

    public GetTargetPokemonSpecies = () : PokemonSpecies => this.targetPokemonSpecies;

    public SetGuessInputValue = (guessInputValue : string) : void => {
        this.guessInputValue = guessInputValue;
    }

    public GetGuessInputValue = () : string => this.guessInputValue;

    public GetInputDisabled = () : boolean => this.inputDisabled;

    public GetDialogIsOpen = () : boolean => this.dialogIsOpen;

    public GetEndGameDialogMessage = () : string => this.endGameDialogMessage;

    public GetEndGameDialogTitle = () : string => this.endGameDialogTitle;

    public GetAlertIsOpen = () : boolean => this.alertOpen;

    public SetAlertIsOpen = (isOpen : boolean) : void => {
        this.alertOpen = isOpen;
    }

    public GetAlertMessage = () : string => this.alertMessage;
}