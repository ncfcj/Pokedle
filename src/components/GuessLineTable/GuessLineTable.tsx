import { useEffect, useState } from "react";
import "./GuessLineTable.css";
import { PokemonData } from "../../types/PokemonData";
import { GuessLine } from "../GuessLine/GuessLine";
import { PokemonSpecies } from "../../types/PokemonSpecies";
import {GuessLineTableHeader} from "../GuessLineTableHeader/GuessLineTableHeader";

type GuessLineListComponent  = {
    GuessLineList : PokemonData[],
    TargetPokemonData : PokemonData,
    TargetPokemonSpecies : PokemonSpecies
}

export const GuessLineTable = (props : GuessLineListComponent) => {
    const [guessList, setGuessList] = useState<PokemonData[]>([] as PokemonData[]);

    useEffect(() => {
        setGuessList(props.GuessLineList);
    }, [props.GuessLineList])
    
    return(
    <div className='table'>
        <GuessLineTableHeader></GuessLineTableHeader>
        <div className={'guessLineTableBody'}>
            {
                guessList != undefined ? guessList.map(x => {
                    return <GuessLine
                        key={x.name}
                        targetPokemonData={props.TargetPokemonData}
                        guessPokemonData={x}
                        targetPokemonSpecies={props.TargetPokemonSpecies}></GuessLine>
                }) : ""
            }
        </div>
    </div>
    )
}