import pokemonJson from "../data/pokemon.json"
import { Generations } from "../enums/Generations";
import { PokemonData } from "../types/PokemonData";
import { PokemonJson } from "../types/PokemonJson";
import {PokeApiHandler} from "./PokeApiHandler";

export class PokemonDataService {
    private totalPokemonId : number = 809;
    private totalFirstGenerationPokemonId : number = 151;

    public RetrieveNewPokemon = () : PokemonData => {
        const randomPokemonId = Math.floor(Math.random() * this.totalFirstGenerationPokemonId) + 1;
        return this.GetPokemonData(randomPokemonId);
    }

    public RetrievePokemonSpeciesAsync = async (pokemonId: number) => {
        return await PokeApiHandler.RetrievePokemonSpeciesAsync(pokemonId);
    }

    public GetPokemonData = (pokemonId : number) : PokemonData => {
        const pokemonData = pokemonJson[pokemonId - 1];
        return {
            name : pokemonData.name,
            generation : pokemonData.generation,
            types : [pokemonData.type1, pokemonData.type2],
            isLegendary : pokemonData.is_legendary == 1,
            id: pokemonId
        } as PokemonData
    }

    public GetPokemonByName = (pokemonName : string) => {
        const pokemonFound = pokemonJson
            .find(pokemon => pokemon.name.toUpperCase() == pokemonName.trim().toUpperCase());

        if (pokemonFound == undefined)
            throw new Error("There isn't a pokemon with this name, please try again!");

        return {
            name : pokemonFound.name,
            generation : pokemonFound.generation,
            types : [pokemonFound.type1, pokemonFound.type2],
            isLegendary : pokemonFound.is_legendary == 1,
            id : this.GetPokemonId(pokemonFound),
            guessNumber : 0
        } as PokemonData
    }

    public GetPokemonId = (pokemon: any) => {
        const index = pokemonJson.indexOf(pokemon) + 1;
        return index;
    }

    public GetPokemonList = () => {
        return pokemonJson as PokemonJson[];
    }

    public GetGenerationNameFromId = (generationId : number) => {
        return Generations[generationId];
    }
}