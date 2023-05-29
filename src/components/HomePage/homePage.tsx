import "./homePage.css"
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {PokemonService} from "../../services/PokemonService";

export const HomePage = () => {
    const service = new PokemonService();

    useEffect(() => {
        service.clearLocalStorage();
    }, [])

    return (
        <div className="homePageContainer">
            <h1 className="siteTitle">Pokerdle</h1>
            <div className="gameModeButtonContainer">
                <Link to={"/modes/classic"}>
                    <button className={"gameModeButton"}>Classic</button>
                </Link>
                <Link to={"/modes/lives"}>
                    <button className={"gameModeButton"}>Lives</button>
                </Link>
            </div>
        </div>
    )
}