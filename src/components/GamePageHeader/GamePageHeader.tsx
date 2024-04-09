import "./GamePageHeader.css"
import {Link} from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, {KeyboardEvent, useState} from "react";
import {PokemonDataService} from "../../services/PokemonDataService";

interface GamePageHeaderProps {
    InputValueHandler : Function
}

export const GamePageHeader = (props : GamePageHeaderProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const pokemonDataService = new PokemonDataService();

    const handleAutocompleteKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter"){
            console.log("Clicking enter value -> " + inputValue);
            props.InputValueHandler(inputValue);
            clearAutocompleteTextBox();
        }
    }

    const handleButtonOnClick = () => {
        console.log("Clicking Button value -> " + inputValue);
        props.InputValueHandler(inputValue);
        clearAutocompleteTextBox();
    }

    const clearAutocompleteTextBox = () => {
        const autocompleteClearButton: HTMLElement = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0] as HTMLElement;

        if (autocompleteClearButton != undefined)
            autocompleteClearButton.click();
    }

    return (<>
        <div className="guessContainer">
            <div className="return">
                <Link to={"/"} >
                    <button className={"returnButton"} title="Return to main menu!">
                        <img className={"returnButtonImage"} src={"/return.png"} alt={"Return to main menu!"}/>
                    </button>
                </Link>
            </div>
            <div className="nameInput">
                <div className={'inputAndButton'}>
                    <Autocomplete
                        onKeyUp={handleAutocompleteKeyUp}
                        clearOnBlur={false}
                        blurOnSelect={"mouse"}
                        id="guessInput"
                        options={pokemonDataService.GetPokemonList()}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => pokemonDataService.GetGenerationNameFromId(option.generation)}
                        sx={{
                            minWidth : "20dvw",
                            maxWidth: "20dvw",
                            display: "flex",
                            alignItems: "center"
                        }}
                        onInputChange={(event, value) => {
                            setInputValue(value);
                        }}
                        inputValue={inputValue}
                        renderInput={(params) =>
                            <TextField {...params}
                                       label="Pokemon"
                                       className={"guessInput pokemonText"}
                            />}
                    />
                    <button className="guessInputButton" onClick={handleButtonOnClick}>Guess</button>
                </div>
                <div className={"space"}></div>
            </div>
        </div>
    </>)
}