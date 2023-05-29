import {useEffect, useState} from "react";
import "./gamePage.css";
import {PokemonService} from "../../services/PokemonService";
import {PokemonData} from "../../types/PokemonData";
import {GuessLineList} from "../GuessLineList/GuessLineList";
import axios from "axios";
import {PokemonSpecies} from "../../types/PokemonSpecies";
import {VictoryDialog} from "../Dialog/VictoryDialog";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {PokemonJson} from "../../types/PokemonJson";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {GameMode} from "../../enums/GameMode";

export const GamePage = () => {
    const [guessLineList, setGuessLineList] = useState<PokemonData[]>([] as PokemonData[]);
    const [targetPokemonData, setTargetPokemonData] = useState<PokemonData>({} as PokemonData);
    const [guessInputValue, setGuessInputValue] = useState<string>("");
    const [targetPokemonSpecies, setTargetPokemonSpecies] = useState<PokemonSpecies>({} as PokemonSpecies);
    const [guessNumber, setGuessNumber] = useState<number>(0);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [resetGame, setResetGame] = useState<number>(0);
    const [lastGuess, setLastGuess] = useState<string>("");
    const [pokemonList, setPokemonList] = useState<PokemonJson[]>([] as PokemonJson[]);
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.Classic);
    const [lives, setLives] = useState<number>(5);

    //#region ReactRouter Location Handling
    const location = useLocation();
    const navigate = useNavigate();
    //#endregion

    const service = new PokemonService();

    const getTargetPokemonData = () => {
        service.handleLocalStorage();
        const pokemonNumber = localStorage.getItem("pokemon");
        const pokemonData = service.getPokemonData(parseInt(pokemonNumber!));

        setTargetPokemonData(pokemonData);
        getTargetPokemonSpecies(pokemonData.id);
    }

    const resetLivesGame = () => {
        setLives(5);
        handleClose();
    }

    const guessPokemon = () => {
        let guess = guessNumber + 1;
        
        const pokemon = service.getPokemonByName(guessInputValue, guess);
        if (pokemon == undefined) {
            alert("There isn't a pokemon with this name, please try again !");
            return;
        }
        setGuessNumber(guess);

        if (guessLineList.find(x => x.name == pokemon.name)) {
            alert("You already guessed this pokemon!");
            return;
        }
                
        // Adds a new guess in the list and sorts it before storing in the state
        var guessLineArray = guessLineList;
        guessLineArray.push(pokemon);
        guessLineArray.sort((a, b) => {
            var keyA = a.guessNumber;
            var keyB = b.guessNumber;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        setGuessLineList(guessLineArray);

        setLastGuess(pokemon.name);

        // clear the input value before a new guess
        setGuessInputValue("");
        let autoCompleteClearButton: HTMLElement = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0] as HTMLElement;
        autoCompleteClearButton.click();

        setTimeout(() => {
            if (targetPokemonData.name.trim().toUpperCase() == pokemon.name.trim().toUpperCase()){
                setDialogIsOpen(true);
                setInputDisabled(true);
                setNewPokemonInLocalStorage();
                return;
            }
            else if (gameMode == GameMode.Lives){
                setLives(lives - 1);
                if (lives - 1 == 0){
                    window.confirm("No lives left, You lost ! :( Try Again ?") ? resetLivesGame() : navigate("/");
                }
            }
        }, 300);
        
    }

    const getTargetPokemonSpecies = async (pokemonId : number) => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        setTargetPokemonSpecies(res.data);
    }

    const setNewPokemonInLocalStorage = () => {
        var totalOfPokemons = 251;
        localStorage.setItem("pokemon", (Math.floor(Math.random() * totalOfPokemons) + 1).toString());
    }

    const verifyGameMode = () => {
        if (location.pathname.includes("modes/lives")){
            setGameMode(GameMode.Lives);
        }

        if (location.pathname.includes("modes/classic")){
            setGameMode(GameMode.Classic);
        }
    }

    const hideHints = () => {
        if (gameMode == GameMode.Classic)
            return "hide";

        return "";
    }

    const firstLetterToUpper = (word : string) => {
        if (word == undefined || word == "" || word == " ")
            return "";

        var firstLetter = word[0].toUpperCase();
        var restOfWord = word.slice(1);

        return firstLetter + restOfWord;
    }

    const getTargetPokemonTypes = () => {
        if (targetPokemonData.types == undefined)
            return "";

        return targetPokemonData.types.map(x => { return firstLetterToUpper(x) }).join(", ");
    }

    const getTargetPokemonColor = () => {
        if (targetPokemonSpecies.color == undefined)
            return "";

        return firstLetterToUpper(targetPokemonSpecies.color?.name);
    }

    const handleClose = () => {
        setDialogIsOpen(false);
        setInputDisabled(false);
        setGuessLineList([] as PokemonData[]);
        setGuessNumber(0);
        setNewPokemonInLocalStorage();
        let resetGameNumber = resetGame;
        setResetGame(resetGameNumber++);
        getTargetPokemonData();
        setGuessInputValue("");
    };

    useEffect(() => {
        verifyGameMode();
        const service = new PokemonService();
        setPokemonList(service.getPokemonList() as PokemonJson[]);
        getTargetPokemonData();
    }, []);

    return(
        <div className='container'>
            <div className={"return"}>
                <Link to={"/"} >
                    <button className={"returnButton"} title="Return to main menu !">
                        <img className={"returnButtonImage"} src={"/return.png"} alt={"Return to main menu !"}/>
                    </button>
                </Link>
            </div>
            <div className="nameInput">
                <Autocomplete
                    clearOnBlur={false}
                    blurOnSelect={"mouse"}
                    id="guessInput"
                    options={pokemonList}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => service.getGenerationNameFromId(option.generation)}
                    sx={{ width: 300 }}
                    onInputChange={async (event, value) => {
                        setGuessInputValue(value);
                    }}
                    inputValue={guessInputValue}
                    renderInput={(params) => 
                        <TextField {...params} 
                            label="Pokemon" 
                            disabled={inputDisabled}
                            className={"guessInput pokemonText"}
                        />}
                />
                <button
                    disabled={inputDisabled}
                    onClick={guessPokemon}
                    className="guessInputButton">Guess</button>
            </div>
            <div className={`hints ${hideHints()}`}>
                <div>Lives: {lives} Lives</div>
                <div>Type(s): {getTargetPokemonTypes()}</div>
                <div>Color: {getTargetPokemonColor()}</div>
            </div>
            <GuessLineList 
                GuessLineList={guessLineList}
                TargetPokemonData={targetPokemonData}
                TargetPokemonSpecies={targetPokemonSpecies}></GuessLineList>
            <VictoryDialog
                open={dialogIsOpen}
                onClose={handleClose}
                message={`You have guessed ${lastGuess} in ${guessNumber} tries !`}
            />
      </div>
    )
}