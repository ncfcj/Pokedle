import "./HeartsContainer.css"
import HeartSvg from "../../assets/heart.svg";
import {useEffect} from "react";

interface HeartsContainerProperties {
    Lives: number
}

export const HeartsContainer = (props : HeartsContainerProperties) => {
    const CreateArrayBasedOnLives = () : number[] => {
        if (props.Lives == 0)
            return [];

        let livesArray : number[] = [];

        for(var i = 0; i < props.Lives; i++){
            livesArray.push(1);
        }

        return livesArray;
    }

    useEffect(() => {}, [props.Lives])

    return (<>
        {CreateArrayBasedOnLives().map(() => {
            return <img key={Math.random() * (100)} className="heart" src={HeartSvg} alt="Heart"/>
        })}
    </>)
}