import { useEffect, useState } from "react";
import { IPokemonData } from "../../interfaces/IPokemonData";
import "./GuessLine.css";
import axios from "axios";
import { IPokemonSpecies } from "../../interfaces/IPokemonSpecies";

interface IGuessLineComponent {
    targetPokemonData : IPokemonData,
    guessPokemonData : IPokemonData,
    targetPokemonSpecies : IPokemonSpecies
}

export const GuessLine = (props : IGuessLineComponent) => {
    const [guessPokemonSpecies, setGuessPokemonSpecies] = useState<IPokemonSpecies>({} as IPokemonSpecies);

    const getSpritePathById = (pokemonId : number) => {
        if(pokemonId > 0 && pokemonId <= 9){
            return `/sprites/00${pokemonId}MS.png`;
        }

        if(pokemonId > 9 && pokemonId <= 99){
            return `/sprites/0${pokemonId}MS.png`;
        }

        return `/sprites/${pokemonId}MS.png`;
    }

    const getGenerationByNumber = (generationNumber : number) => {
        switch (generationNumber) {
            case 1:
                return "Kanto";
            
            case 2:
                return "Johto";
            
            case 3:
                return "Hoenn";
            
            case 4:
                return "Sinnoh";
            
            case 5:
                return "Unova";
            
            case 6:
                return "Kalos";
            
            case 7:
                return "Alola";
        
            default:
                return "";
        }
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
            if (types.includes(x))
                isInArray++;
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
        if (props.targetPokemonSpecies.habitat == undefined) return "";
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

    const verifyLegendary = (isLegendary : boolean) => {
        if (isLegendary == props.targetPokemonData.isLegendary) return "right";
        
        return "wrong";
    }

    const writeShape = () => {
        if (guessPokemonSpecies.shape == undefined) return "";
        
        return capitalizeFirstLetter(guessPokemonSpecies.shape.name);
    }

    const writeHabitat = () => {
        if (guessPokemonSpecies.habitat == undefined) return "";
        
        return capitalizeFirstLetter(guessPokemonSpecies.habitat.name);
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
                <p className="pokemonText wrap">{getGenerationByNumber(props.guessPokemonData.generation)}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyHabitat()}`}>
                <p className="pokemonText wrap">{writeHabitat()}</p>
            </div>
            <div className={`hint justifyWrappedText ${verifyShape()}`}>
                <p className="pokemonText wrap">{writeShape()}</p>
            </div>
            <div className={`lastHint justifyWrappedText ${verifyLegendary(props.guessPokemonData.isLegendary)}`}>
                <p className="pokemonText wrap">{props.guessPokemonData.isLegendary ? "Legendary" : "Normal"}</p>
            </div>
        </div>
    )
}