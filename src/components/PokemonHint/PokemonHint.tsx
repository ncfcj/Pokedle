import {StringHelper} from "../../helpers/StringHelper";
import {GameMode} from "../../enums/GameMode";
import "./PokemonHint.css";
import {HeartsContainer} from "../HeartsContainer/HeartsContainer";

interface PokemonHintProperties {
    Lives: number,
    Types: string[],
    Color: string,
    GameMode : GameMode,
    children?: JSX.Element|JSX.Element[];
}

export const PokemonHint = (props : PokemonHintProperties) => {
    const handleTypes = () : string => {
        if (props.Types == undefined)
            return "";

        if (props.Types[1] != "")
            return props.Types.map(x => { return StringHelper.CapitalizeFirstLetter(x) }).join(", ");

        return StringHelper.CapitalizeFirstLetter(props.Types[0]);
    }

    const hideHints = () : string => {
        if (props.GameMode === GameMode.Classic)
            return "hide";

        return "";
    }

    const handleColor = () : string => {
        return StringHelper.CapitalizeFirstLetter(props.Color);
    }

    return(
        <div className={`hints ${hideHints()}`}>
            <div className="hintLine heartLine">
                Lives: <HeartsContainer Lives={props.Lives}></HeartsContainer>
            </div>
            <div className="hintLine">Type(s): {handleTypes()}</div>
            <div className="hintLine">Color: {handleColor()}</div>
        </div>)
}