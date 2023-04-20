import { useEffect, useState } from "react";
import "./GuessLineList.css";
import { IPokemonData } from "../../interfaces/IPokemonData";
import { GuessLine } from "../GuessLine/GuessLine";
import { IPokemonSpecies } from "../../interfaces/IPokemonSpecies";

interface IGuessLineListComponent {
    GuessLineList : IPokemonData[],
    TargetPokemonData : IPokemonData,
    TargetPokemonSpecies : IPokemonSpecies
}

export const GuessLineList = (props : IGuessLineListComponent) => {
    const [guessList, setGuessList] = useState<IPokemonData[]>([] as IPokemonData[]);

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