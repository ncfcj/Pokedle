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
            <div className="header">
                <div className="pokemonImageHeader pokemonText">Pokemon</div>
                <div className="pokemonNameHeader nameHeader pokemonText">Name</div>
                <div className="pokemonTypesHeader headerItem types pokemonText">Types</div>
                <div className="pokemonRegionHeader headerItem region pokemonText">Region</div>
                <div className="pokemonHabitatHeader headerItem habitat pokemonText">Habitat</div>
                <div className="pokemonShapeHeader headerItem shape pokemonText">Shape</div>
                <div className="pokemonColorHeader headerItem color pokemonText">Color</div>
                <div className="pokemonRarityHeader lastHeaderItem rarity pokemonText">Rarity</div>
            </div>
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