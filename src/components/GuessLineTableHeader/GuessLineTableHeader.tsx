import "./GuessLineTableHeader.css";
import {useEffect} from "react";

export const GuessLineTableHeader = () => {
    useEffect(() => {});

    return(
        <div className="guessLineTableHeader">
            <div className="pokemonImageHeader pokemonText">Pokemon</div>
            <div className="pokemonNameHeader nameHeader pokemonText">Name</div>
            <div className="pokemonTypesHeader headerItem types pokemonText">Types</div>
            <div className="pokemonRegionHeader headerItem region pokemonText">Region</div>
            <div className="pokemonHabitatHeader headerItem habitat pokemonText">Habitat</div>
            <div className="pokemonShapeHeader headerItem shape pokemonText">Shape</div>
            <div className="pokemonColorHeader headerItem color pokemonText">Color</div>
            <div className="pokemonRarityHeader lastHeaderItem rarity pokemonText">Rarity</div>
        </div>
    );
}