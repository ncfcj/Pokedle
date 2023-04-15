import { ChangeEvent, useEffect, useState } from "react";
import "./mainPage.css";
import { PokemonService } from "../../services/PokemonService";
import { IPokemonData } from "../../interfaces/IPokemonData";
import { GuessLineList } from "../GuessLineList/GuessLineList";

export const MainPage = () => {
    const [guessLineList, setGuessLineList] = useState<IPokemonData[]>([] as IPokemonData[]);
    const [targetPokemonData, setTargetPokemonData] = useState<IPokemonData>({} as IPokemonData);
    const [guessInputValue, setGuessInputValue] = useState<string>("");

    const service = new PokemonService();

    const getTargetPokemonData = async () => {
        service.handleLocalStorage();
        const pokemonNumber = localStorage.getItem("pokemon");
        const pokemonData = await service.getPokemonData(parseInt(pokemonNumber!));

        setTargetPokemonData(pokemonData);
    }

    const guessPokemon = () => {
        const pokemon = service.getPokemonByName(guessInputValue);
        if (pokemon == undefined) {
            alert("There isn't a pokemon with this name, please try again !");
            return;
        }

        if (targetPokemonData.name.toUpperCase() == guessInputValue.trim().toUpperCase())
            //ganhou
            return;
        
        var guessLineArray = guessLineList;
        guessLineArray.push(pokemon);
        setGuessLineList(guessLineArray);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuessInputValue(e.target.value);
    };

    useEffect(() => {
        getTargetPokemonData();
    }, []);

    return(
        <div className='container'>
            <div className="nameInput">
              <input className="guessInput" onChange={handleChange} value={guessInputValue}></input>
              <button onClick={guessPokemon} className="guessInputButton">Guess</button>
            </div>
            <GuessLineList GuessLineList={guessLineList}></GuessLineList>
      </div>
    )
}