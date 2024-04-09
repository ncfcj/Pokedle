import "./GamePageTable.css"
import {PokemonHint} from "../PokemonHint/PokemonHint";
import {GuessLineTable} from "../GuessLineTable/GuessLineTable";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {GamePageSliceState} from "../../types/GamePageSliceState";

export const GamePageTable = () => {
    const {
        guessedPokemonList,
        targetPokemonData,
        targetPokemonSpecies,
        gameMode,
        lives,
        targetPokemonColor,
        targetPokemonTypes} = useSelector((state : GamePageSliceState) => state.GamePage);

    useEffect(() => {
    }, []);

    return (<>
        <div className="gameContainer">
            <PokemonHint
                Types={targetPokemonTypes}
                Color={targetPokemonColor}
                Lives={lives}
                GameMode={gameMode}
            ></PokemonHint>
            <GuessLineTable
                GuessLineList={guessedPokemonList}
                TargetPokemonData={targetPokemonData}
                TargetPokemonSpecies={targetPokemonSpecies}></GuessLineTable>
        </div>
    </>)
}