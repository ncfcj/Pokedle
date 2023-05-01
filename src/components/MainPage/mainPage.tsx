import { ChangeEvent, useEffect, useState } from "react";
import "./mainPage.css";
import { PokemonService } from "../../services/PokemonService";
import { PokemonData } from "../../types/PokemonData";
import { GuessLineList } from "../GuessLineList/GuessLineList";
import axios from "axios";
import { PokemonSpecies } from "../../types/PokemonSpecies";
import { VictoryDialog } from "../Dialog/VictoryDialog";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { PokemonJson } from "../../types/PokemonJson";

export const MainPage = () => {
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    const service = new PokemonService();

    const getTargetPokemonData = () => {
        service.handleLocalStorage();
        const pokemonNumber = localStorage.getItem("pokemon");
        const pokemonData = service.getPokemonData(parseInt(pokemonNumber!));

        setTargetPokemonData(pokemonData);
        getTargetPokemonSpecies(pokemonData.id);
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
        setIsOpen(false);

        setTimeout(() => {
            if (targetPokemonData.name.trim().toUpperCase() == pokemon.name.trim().toUpperCase()){
                setDialogIsOpen(true);
                setInputDisabled(true);
                setNewPokemonInLocalStorage();
                return;
            }
        }, 300);
        
    }

    const getTargetPokemonSpecies = async (pokemonId : number) => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        setTargetPokemonSpecies(res.data);
    }

    const setNewPokemonInLocalStorage = () => {
        var totalOfPokemonsInGen1 = 151;
        localStorage.setItem("pokemon", (Math.floor(Math.random() * totalOfPokemonsInGen1) + 1).toString());
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
        const service = new PokemonService();
        setPokemonList(service.getPokemonList() as PokemonJson[]);
        getTargetPokemonData();
    }, []);

    return(
        <div className='container'>
            <div className="nameInput">
                <Autocomplete
                    clearOnBlur={false}
                    id="guessInput"
                    options={pokemonList}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => service.getGenerationNameFromId(option.generation)}
                    sx={{ width: 300 }}
                    onInputChange={async (event, value) => {
                        setGuessInputValue(value);
                        value == '' ? setIsOpen(false) : setIsOpen(true);
                    }}
                    inputValue={guessInputValue}
                    open={isOpen}
                    renderInput={(params) => 
                        <TextField {...params} 
                            label="Pokemon" 
                            disabled={inputDisabled}
                            className={"guessInput pokemonText"}/>}
                />
              <button 
                disabled={inputDisabled}
                onClick={guessPokemon} 
                className="guessInputButton">Guess</button>
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