import {useEffect, useState, KeyboardEvent, SyntheticEvent} from "react";
import "./gamePage.css";
import {PokemonService} from "../../services/PokemonService";
import {PokemonData} from "../../types/PokemonData";
import {GuessLineList} from "../GuessLineList/GuessLineList";
import axios from "axios";
import {PokemonSpecies} from "../../types/PokemonSpecies";
import {EndGameDialog} from "../EndGameDialog/EndGameDialog";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {PokemonJson} from "../../types/PokemonJson";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {GameMode} from "../../enums/GameMode";
import HeartSvg from "../../assets/heart.svg";
import Alert from '@mui/material/Alert';
import {Collapse, IconButton, Snackbar} from "@mui/material";

function CloseIcon(props: { fontSize: string }) {
    return null;
}

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
    const [lives, setLives] = useState<number[]>([1, 1, 1, 1, 1] as number[]);
    const [render, setRender] = useState<number>(0);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [endGameDialogMessage, setEndGameDialogMessage] = useState<string>("");
    const [endGameDialogTitle, setEndGameDialogTitle] = useState<string>("");


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
        setLives([1,1,1,1,1]);
        handleClose();
    }

    const guessPokemon = () => {
        let guess = guessNumber + 1;
        
        const pokemon = service.getPokemonByName(guessInputValue, guess);
        if (pokemon == undefined) {
            setAlertMessage("There isn't a pokemon with this name, please try again!");
            setAlertOpen(true);
            return;
        }
        setGuessNumber(guess);

        if (guessLineList.find(x => x.name == pokemon.name)) {
            setAlertMessage("You already guessed this pokemon!");
            setAlertOpen(true);
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
                setEndGameDialogTitle("Congratulations!")
                setEndGameDialogMessage(`You have guessed ${targetPokemonData.name} in ${guessNumber + 1} tries!`);
                setDialogIsOpen(true);
                setInputDisabled(true);
                setNewPokemonInLocalStorage();
                setGuessNumber(0);
                return;
            }
            else if (gameMode == GameMode.Lives){
                lives.pop();

                if (lives.length == 0){
                    setEndGameDialogTitle("Too Bad!")
                    setEndGameDialogMessage(`The pokemon was ${targetPokemonData.name}!`);
                    setDialogIsOpen(true);
                    setInputDisabled(true);
                    setNewPokemonInLocalStorage();
                    setGuessNumber(0);
                }

                setRender(render + 1);
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

        if (targetPokemonData.types[1] != "")
            return targetPokemonData.types.map(x => { return firstLetterToUpper(x) }).join(", ");

        return firstLetterToUpper(targetPokemonData.types[0]);
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
        setLives([1, 1, 1, 1, 1]);
    };

    const handleSnackbarClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    }

    const handleInputEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter")
            guessPokemon();
    }

    useEffect(() => {
        verifyGameMode();
        const service = new PokemonService();
        setPokemonList(service.getPokemonList() as PokemonJson[]);
        getTargetPokemonData();
    }, [render]);

    return(
        <div className='container'>
            <div className="guessContainer">
                <div className="return">
                    <Link to={"/"} >
                        <button className={"returnButton"} title="Return to main menu!">
                            <img className={"returnButtonImage"} src={"/return.png"} alt={"Return to main menu!"}/>
                        </button>
                    </Link>
                </div>
                <div className="nameInput">
                    <Autocomplete
                        onKeyUp={handleInputEnter}
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
            </div>
            <div className="gameContainer">
                <div className={`hints ${hideHints()}`}>
                    <div className="hintLine heartLine">
                        Lives: {lives.map(() => {
                            return <img key={Math.random() * (100)} className="heart" src={HeartSvg} alt="Heart"/>
                        })}
                    </div>
                    <div className="hintLine">Type(s): {getTargetPokemonTypes()}</div>
                    <div className="hintLine">Color: {getTargetPokemonColor()}</div>
                </div>
                <GuessLineList
                    GuessLineList={guessLineList}
                    TargetPokemonData={targetPokemonData}
                    TargetPokemonSpecies={targetPokemonSpecies}></GuessLineList>
                <EndGameDialog
                    open={dialogIsOpen}
                    onClose={handleClose}
                    message={endGameDialogMessage}
                    title={endGameDialogTitle}
                />
            </div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={alertOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}>
                <Alert
                    variant="filled"
                    severity="warning"
                    action={
                        <IconButton
                            aria-label="close"
                            color="primary"
                            size="medium"
                            onClick={() => {
                                setAlertOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
      </div>
    )
}