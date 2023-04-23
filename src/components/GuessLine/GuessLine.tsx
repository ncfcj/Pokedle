import { useEffect, useState } from "react";
import { PokemonData } from "../../types/PokemonData";
import "./GuessLine.css";
import axios from "axios";
import { PokemonSpecies } from "../../types/PokemonSpecies";
import { Generations } from "../../enums/Generations";

type GuessLineComponent = {
    targetPokemonData : PokemonData,
    guessPokemonData : PokemonData,
    targetPokemonSpecies : PokemonSpecies
}

export const GuessLine = (props : GuessLineComponent) => {
    const [guessPokemonSpecies, setGuessPokemonSpecies] = useState<PokemonSpecies>({} as PokemonSpecies);

    const getSpritePathById = (pokemonId : number) => {
        if(pokemonId > 0 && pokemonId <= 9){
            return `/sprites/00${pokemonId}MS.png`;
        }

        if(pokemonId > 9 && pokemonId <= 99){
            return `/sprites/0${pokemonId}MS.png`;
        }

        return `/sprites/${pokemonId}MS.png`;
    }

    const getGeneration = (generationNumber : number) => {
        return Generations[generationNumber];
    }

    const handleTypes = (types : string[]) => {
        types = types.map(type => capitalizeFirstLetter(type));

        if (types[1] == "")
            return types[0];
        
        return types.join(",");
    }

    const verifyPokemonName = (name : string) => {
        if (name == props.targetPokemonData.name)
            return "right";
        
        return "wrong";
    }

    const verifyPokemonTypes = (types: string[]) => {
        var isInArray : number = 0;
        var targetTypes = props.targetPokemonData.types.filter(x => x != "");
        var targetPokemonLength : number = targetTypes.length;

        targetTypes.forEach(x => {
            if(types.find(y => y.trim().toUpperCase() == x.trim().toUpperCase())) isInArray++;
        })

        if (isInArray == targetPokemonLength)
            return "right";
        
        if (isInArray < targetPokemonLength && isInArray > 0)
            return "close";
        
        return "wrong";
    }

    const verifyGeneration = (generation : number) => {
        if (generation == props.targetPokemonData.generation) return "right";
        
        return "wrong";
    }

    const verifyHabitat = () => {
        if (props.targetPokemonSpecies.habitat == undefined) return "close";
        if (guessPokemonSpecies.habitat == undefined) return "";
        if (guessPokemonSpecies.habitat.name.trim().toUpperCase() == props.targetPokemonSpecies.habitat.name.trim().toUpperCase()) return "right";
        
        return "wrong";
    }

    const verifyShape = () => {
        if (props.targetPokemonSpecies.shape == undefined) return "";
        if (guessPokemonSpecies.shape == undefined) return "";
        if (guessPokemonSpecies.shape.name.trim().toUpperCase() == props.targetPokemonSpecies.shape.name.trim().toUpperCase()) return "right";
    
        return "wrong";
    }

    const verifyColor = () => {
        if (props.targetPokemonSpecies.color == undefined) return "";
        if (guessPokemonSpecies.color == undefined) return "";
        if (guessPokemonSpecies.color.name.trim().toUpperCase() == props.targetPokemonSpecies.color.name.trim().toUpperCase()) return "right";

        return "wrong";
    }

    const verifyLegendary = (isLegendary : boolean) => {
        if (isLegendary == props.targetPokemonData.isLegendary) return "right";
        
        return "wrong";
    }

    const writeShape = () => {
        if (guessPokemonSpecies.shape == undefined) return "";
        
        return capitalizeFirstLetter(guessPokemonSpecies.shape.name);
    }

    const writeHabitat = () => {
        if (guessPokemonSpecies.habitat == undefined) return capitalizeFirstLetter("Unknown");
        
        return capitalizeFirstLetter(guessPokemonSpecies.habitat.name);
    }

    const writeColor = () => {
        if (guessPokemonSpecies.color == undefined) return "";
        
        return capitalizeFirstLetter(guessPokemonSpecies.color.name);
    }

    const capitalizeFirstLetter = (word : string) => {
        if(word == undefined) return "";

        const str = word.charAt(0);
        return str.toUpperCase() + word.slice(1); 
    }

    const getGuessPokemonSpecies = async () => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${props.guessPokemonData.id}`);
        setGuessPokemonSpecies(res.data);
    }

    useEffect(() => {
        getGuessPokemonSpecies();
    }, [props.guessPokemonData])

    return(
        <div className="guess">
            <div className={`hint justifyWrappedText`}>
                <img className="spriteImg" src={getSpritePathById(props.guessPokemonData.id)}></img>
            </div>
            <div className={`name justifyWrappedText ${verifyPokemonName(props.guessPokemonData.name)}`}>
                <p className="pokemonText wrap">{props.guessPokemonData.name}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyPokemonTypes(props.guessPokemonData.types)}`}>
                <p className="pokemonText wrap">{handleTypes(props.guessPokemonData.types)}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyGeneration(props.guessPokemonData.generation)}`}>
                <p className="pokemonText wrap">{getGeneration(props.guessPokemonData.generation)}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyHabitat()}`}>
                <p className="pokemonText wrap">{writeHabitat()}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyShape()}`}>
                <p className="pokemonText wrap">{writeShape()}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyColor()}`}>
                <p className="pokemonText wrap">{writeColor()}</p>
            </div>
            <div className={`lastHint justifyWrappedText ${verifyLegendary(props.guessPokemonData.isLegendary)}`}>
                <p className="pokemonText wrap">{props.guessPokemonData.isLegendary ? "Legendary" : "Normal"}</p>
            </div>
        </div>
    )
}