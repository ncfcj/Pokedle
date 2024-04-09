import React, {useEffect, SyntheticEvent, useState} from "react";
import "./gamePage.css";
import {EndGameDialog} from "../EndGameDialog/EndGameDialog";
import {useLocation, useNavigate} from "react-router-dom";
import {GameMode} from "../../enums/GameMode";
import Alert from '@mui/material/Alert';
import {IconButton, Snackbar} from "@mui/material";
import {PokemonDataService} from "../../services/PokemonDataService";
import {GamePageHeader} from "../GamePageHeader/GamePageHeader";
import {GamePageTable} from "../GamePageTable/GamePageTable";
import { useSelector, useDispatch } from 'react-redux'
import { removeLife,
    changeGameModeToLives,
    changeGameModeToClassic,
    setNewTargetPokemon,
    setNewTargetPokemonSpecies,
    setGuessInputValue,
    addNewGuessedPokemon,
    sortGuessedPokemonList,
    setLives,
    setTotalGuesses,
    resetGame,
    setTargetPokemonColorAndTypes} from '../../slices/GamePageSlice'
import {AppDispatch} from "../../store";
import {PokemonGamePageService} from "../../services/PokemonGamePageService";
import {GamePageSliceState} from "../../types/GamePageSliceState";
import {EndGameDialogState} from "../../types/EndGameDialogState";
import {AlertState} from "../../types/AlertState";

function CloseIcon(props: { fontSize: string }) {
    return null;
}

export const GamePage = () => {
    const [endGameDialogState, setEndGameDialogState] = useState<EndGameDialogState>({EndGameDialogMessage: "", EndGameDialogTitle: "", EndGameDialogIsOpen: false});
    const [alertState, setAlertState] = useState<AlertState>({AlertIsOpen: false, AlertMessage: ""});
    const [resetGameState, setResetGameState] = useState<number>(0);

    // ReactRouter Location Handling
    const location = useLocation();
    const navigate = useNavigate();

    const { guessedPokemonList,
        guessInputValue,
        totalGuesses,
        targetPokemonData,
        targetPokemonSpecies,
        gameMode,
        lives,
        targetPokemonColor,
        targetPokemonTypes} = useSelector((state : GamePageSliceState) => state.GamePage);

    console.log("Logging Redux State");
    console.log({ Lives: lives,
        Gamemode: gameMode,
        TotalGuesses: totalGuesses,
        TargetPokemonData: targetPokemonData,
        TargetPokemonSpecies: targetPokemonSpecies,
        TargetPokemonColor: targetPokemonColor,
        TargetPokemonTypes: targetPokemonTypes,
        GuessedPokemonList: guessedPokemonList,
        GuessInputValue: guessInputValue});

    const dispatch: AppDispatch = useDispatch();

    const pokemonDataService = new PokemonDataService();

    const StartGame = () => {
        if (location.pathname.includes("modes/lives")){
            dispatch(changeGameModeToLives());
            dispatch(setLives(5));
        }

        if (location.pathname.includes("modes/classic")){
            dispatch(changeGameModeToClassic());
        }
    }

    const Guess = (guessedPokemon: string) => {
        try {
            const guessCount = totalGuesses + 1;
            const pokemon = pokemonDataService.GetPokemonByName(guessedPokemon);

            PokemonGamePageService.PokemonAlreadyGuessed(guessedPokemonList, pokemon);

            dispatch(addNewGuessedPokemon(pokemon));
            dispatch(sortGuessedPokemonList());
            dispatch(setTotalGuesses(guessCount));

            // Check if game is over
            CheckGameIsOver(pokemon.name)
        }
        catch (error : any){
            setAlertState({AlertIsOpen: true, AlertMessage: error.message});
            console.error(error.message);
        }
    }

    const EndGame = () => {
        setEndGameDialogState({
            EndGameDialogTitle: "Congratulations!",
            EndGameDialogMessage: `You have guessed ${targetPokemonData.name} in ${totalGuesses} tries!`,
            EndGameDialogIsOpen: true
        });
    }

    const GameLost = () => {
        setEndGameDialogState({
            EndGameDialogTitle: "Too Bad!",
            EndGameDialogMessage: `The pokemon was ${targetPokemonData.name}!`,
            EndGameDialogIsOpen: true
        });
    }

    const CheckGameIsOver = (pokemonName : string) : void => {
        if (PokemonGamePageService.PokemonGuessedCorrectly(targetPokemonData.name, pokemonName))
            EndGame();

        if (gameMode === GameMode.Lives)
            if (lives == 0)
                GameLost();
    }

    const RetrieveNewTargetPokemon = async () => {
        dispatch(resetGame());

        const targetPokemonData = pokemonDataService.RetrieveNewPokemon();
        const targetPokemonSpecies = await pokemonDataService.RetrievePokemonSpeciesAsync(targetPokemonData.id);

        dispatch(setNewTargetPokemon(targetPokemonData));
        dispatch(setTargetPokemonColorAndTypes({pokemonColor: targetPokemonSpecies.color.name, pokemonTypes: targetPokemonData.types}));
        dispatch(setNewTargetPokemonSpecies(targetPokemonSpecies));
    }

    const handleSnackbarClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({AlertMessage: "", AlertIsOpen: false});
    }

    const handleEndGameDialogClose = () => {
        console.log("Resetting the game!");
        setResetGameState(resetGameState + 1);
    }

    const handleInputValue = (inputValue: string) => {
        Guess(inputValue);
    }

    useEffect(() => {
        RetrieveNewTargetPokemon().then(_ => console.log("A new pokemon has been caught!"));
        StartGame();
    }, [resetGameState]);

    return(
        <div className='page'>
            <GamePageHeader
                InputValueHandler={handleInputValue}
            />
            <GamePageTable/>
            <EndGameDialog
                open={endGameDialogState.EndGameDialogIsOpen}
                onClose={handleEndGameDialogClose}
                message={endGameDialogState.EndGameDialogMessage}
                title={endGameDialogState.EndGameDialogTitle}/>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={alertState.AlertIsOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}>
                <Alert
                    variant="filled"
                    severity="warning"
                    action={
                        <IconButton
                            aria-label="close"
                            color="primary"
                            size="medium"
                            onClick={() => {
                                setAlertState({AlertMessage: "", AlertIsOpen: false});
                            }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ width: '100%' }}>
                    {alertState.AlertMessage}
                </Alert>
            </Snackbar>
      </div>
    )
}