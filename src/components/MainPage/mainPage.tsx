import { ChangeEvent, useEffect, useState } from "react";
import "./mainPage.css";
import { PokemonService } from "../../services/PokemonService";
import { IPokemonData } from "../../interfaces/IPokemonData";
import { GuessLineList } from "../GuessLineList/GuessLineList";
import axios from "axios";
import { IPokemonSpecies } from "../../interfaces/IPokemonSpecies";

export const MainPage = () => {
    const [guessLineList, setGuessLineList] = useState<IPokemonData[]>([] as IPokemonData[]);
    const [targetPokemonData, setTargetPokemonData] = useState<IPokemonData>({} as IPokemonData);
    const [guessInputValue, setGuessInputValue] = useState<string>("");
    const [targetPokemonSpecies, setTargetPokemonSpecies] = useState<IPokemonSpecies>({} as IPokemonSpecies);
    
    const service = new PokemonService();

    const getTargetPokemonData = () => {
        service.handleLocalStorage();
        const pokemonNumber = localStorage.getItem("pokemon");
        const pokemonData = service.getPokemonData(parseInt(pokemonNumber!));

        setTargetPokemonData(pokemonData);
    }

    const guessPokemon = () => {
        const pokemon = service.getPokemonByName(guessInputValue);
        if (pokemon == undefined) {
            alert("There isn't a pokemon with this name, please try again !");
            return;
        }
                
        var guessLineArray = guessLineList;
        guessLineArray.push(pokemon);
        setGuessLineList(guessLineArray);
        setGuessInputValue("");
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuessInputValue(e.target.value);
    };

    const getTargetPokemonSpecies = async () => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${targetPokemonData.id}`);
        setTargetPokemonSpecies(res.data);
    }

    useEffect(() => {
        getTargetPokemonData();
        getTargetPokemonSpecies();
    }, []);

    return(
        <div className='container'>
            <div className="nameInput">
              <input className="guessInput pokemonText" onChange={handleChange} value={guessInputValue}></input>
              <button onClick={guessPokemon} className="guessInputButton">Guess</button>
            </div>
            <GuessLineList 
                GuessLineList={guessLineList}
                TargetPokemonData={targetPokemonData}
                TargetPokemonSpecies={targetPokemonSpecies}></GuessLineList>
      </div>
    )
}