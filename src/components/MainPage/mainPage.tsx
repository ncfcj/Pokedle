import { ChangeEvent, useEffect, useState } from "react";
import "./mainPage.css";
import { PokemonService } from "../../services/PokemonService";
import { PokemonData } from "../../types/PokemonData";
import { GuessLineList } from "../GuessLineList/GuessLineList";
import axios from "axios";
import { PokemonSpecies } from "../../types/PokemonSpecies";
import { VictoryDialog } from "../Dialog/VictoryDialog";

export const MainPage = () => {
    const [guessLineList, setGuessLineList] = useState<PokemonData[]>([] as PokemonData[]);
    const [targetPokemonData, setTargetPokemonData] = useState<PokemonData>({} as PokemonData);
    const [guessInputValue, setGuessInputValue] = useState<string>("");
    const [targetPokemonSpecies, setTargetPokemonSpecies] = useState<PokemonSpecies>({} as PokemonSpecies);
    const [guessNumber, setGuessNumber] = useState<number>(0);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    
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
        setGuessNumber(guess);

        const pokemon = service.getPokemonByName(guessInputValue, guess);
        if (pokemon == undefined) {
            alert("There isn't a pokemon with this name, please try again !");
            return;
        }

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

        // clear the input value before a new guess
        setGuessInputValue("");

        setTimeout(() => {
            if (targetPokemonData.name.trim().toUpperCase() == pokemon.name.trim().toUpperCase()){
                setDialogIsOpen(true);
                setInputDisabled(true);
                setNewPokemonInLocalStorage();
                return;
            }
        }, 300);
        
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuessInputValue(e.target.value);
    };

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
    };

    useEffect(() => {
        getTargetPokemonData();
    }, []);

    return(
        <div className='container'>
            <div className="nameInput">
              <input 
                className="guessInput pokemonText" 
                disabled={inputDisabled}
                onChange={handleChange} 
                value={guessInputValue}></input>
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
                message={`Congratulations! You have guessed ${targetPokemonData.name} in ${guessNumber} tries !`}
            />
      </div>
    )
}