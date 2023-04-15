import { useEffect, useState } from "react";
import "./GuessLineList.css";
import { IPokemonData } from "../../interfaces/IPokemonData";

interface IGuessLineListComponent {
    GuessLineList : IPokemonData[]
}

export const GuessLineList = (props : IGuessLineListComponent) => {
    const [guessList, setGuessList] = useState<IPokemonData[]>([] as IPokemonData[]);

    useEffect(() => {
        setGuessList(props.GuessLineList);
    }, [props.GuessLineList])
    
    return(
        <div className='guessLineContainer'>
        </div>
    )
}