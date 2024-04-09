import "./Type.scss";
import {PokemonType} from "../../enums/PokemonType";
import {PokemonTypeHelper} from "../../helpers/PokemonTypeHelper";

interface PokemonTypeProps {
    PokemonType : PokemonType,
    TargetPokemonTypes: string[]
}

export const Type = (props : PokemonTypeProps) => {
    const basePath = import.meta.env.BASE_URL;

    const GetPokemonTypeName = () : string => {
        return PokemonType[props.PokemonType];
    }

    const GetTypeUrl = () : string => {
        const normalizedTypeName = GetPokemonTypeName().toLowerCase();
        return `/types/${normalizedTypeName}.svg`;
    }

    const GetPokemonTypeAltDescription = () : string => {
        return `Pokemon Type ${GetPokemonTypeName()}`
    }

    const GetTypeBackgroundColor = () => {
        const targetTypes = GetPokemonTypesArray();

        if(targetTypes.includes(props.PokemonType)) return "right"

        return "wrong";
    }

    const GetPokemonTypesArray = () => {
        return props.TargetPokemonTypes.map(type => {
            if(type != "")
                return PokemonTypeHelper.GetPokemonTypeByName(type)
        });
    }

    return <div className={`type ${GetTypeBackgroundColor()}`}>
        <img alt={GetPokemonTypeAltDescription()} src={GetTypeUrl()} className="typeSymbol"></img>
        <div className="typeName pokemonText">{GetPokemonTypeName()}</div>
    </div>
}