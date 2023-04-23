import { useEffect, useState } from "react";
import "./GuessLineList.css";
import { PokemonData } from "../../types/PokemonData";
import { GuessLine } from "../GuessLine/GuessLine";
import { PokemonSpecies } from "../../types/PokemonSpecies";

type GuessLineListComponent  = {
    GuessLineList : PokemonData[],
    TargetPokemonData : PokemonData,
    TargetPokemonSpecies : PokemonSpecies
}

export const GuessLineList = (props : GuessLineListComponent) => {
    const [guessList, setGuessList] = useState<PokemonData[]>([] as PokemonData[]);

    useEffect(() => {
        setGuessList(props.GuessLineList);
    }, [props.GuessLineList])
    
    return(
        <div className='guessLineContainer'>
            {
                guessList.map(x => {
                    return <GuessLine 
                                key={x.name}
                                targetPokemonData={props.TargetPokemonData} 
                                guessPokemonData={x}
                                targetPokemonSpecies={props.TargetPokemonSpecies}></GuessLine>
                })
            }
        </div>
    )
}