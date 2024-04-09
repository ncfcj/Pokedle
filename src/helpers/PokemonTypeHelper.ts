import {PokemonType} from "../enums/PokemonType";

export class PokemonTypeHelper {
    public static GetPokemonTypeByName = (pokemonTypeName: string) : PokemonType => {
        const normalizedTypeName = pokemonTypeName.toUpperCase();

        switch (normalizedTypeName) {
            case "FIRE" : return PokemonType.Fire
            case "WATER" : return PokemonType.Water
            case "GRASS" : return PokemonType.Grass
            case "GROUND" : return PokemonType.Ground
            case "DARK" : return PokemonType.Dark
            case "DRAGON" : return PokemonType.Dragon
            case "FAIRY" : return PokemonType.Fairy
            case "GHOST" : return PokemonType.Ghost
            case "NORMAL" : return PokemonType.Normal
            case "PSYCHIC" : return PokemonType.Psychic
            case "STEEL" : return PokemonType.Steel
            case "ROCK" : return PokemonType.Rock
            case "POISON" : return PokemonType.Poison
            case "ICE" : return PokemonType.Ice
            case "FLYING" : return PokemonType.Flying
            case "ELECTRIC" : return PokemonType.Electric
            case "BUG" : return PokemonType.Bug
            case "FIGHTING" : return PokemonType.Fighting
        }

        return PokemonType.Any;
    }

}