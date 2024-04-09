import {PokemonSpecies} from "../types/PokemonSpecies";
import axios from "axios";

export class PokeApiHandler {
    public static RetrievePokemonSpeciesAsync = async (pokemonId : number) : Promise<PokemonSpecies> => {
        const url : string = "https://pokeapi.co/api/v2/pokemon-species/" + pokemonId;
        try {
            const apiResponse = await axios.get(url);

            if (apiResponse.status != 200)
                throw new Error(`Falha ao recuperar PokemonSpecies. (Http status code : ${apiResponse.status})`);

            const data : PokemonSpecies = await apiResponse.data;
            console.log(data);

            return data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}