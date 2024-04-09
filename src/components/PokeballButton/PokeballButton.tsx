import "./PokeballButton.scss"
import {createRef, useRef} from "react";

interface PokeballButtonProps {
    buttonClickHandler : Function
    buttonText : string
}

export const PokeballButton = (props : PokeballButtonProps) => {
    const guessInputButtonRef = createRef<HTMLDivElement>();
    const guessInputButton = guessInputButtonRef.current;

    const handleButtonClick = () => {
        props.buttonClickHandler();
    }

    const handleMouseEnter = () => {
        guessInputButton?.className.concat("animated");
    }

    return(
        <div
            className="guessInputButton"
            onClick={handleButtonClick}
            ref={guessInputButtonRef}
            onMouseEnter={handleMouseEnter}
        >
            <div className="pokeballBase">
                <div className="pokeball">
                    <div className="upper-half"></div>
                    <div className="lower-half"></div>
                    {props.buttonText}
                    <div className="base"></div>
                    <div className="inner-circle"></div>
                    <div className="indicator visible"></div>
                    <div className="indicator-inner"></div>
                </div>
            </div>
        </div>)
}