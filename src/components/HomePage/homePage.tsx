import "./homePage.css"
import {Link} from "react-router-dom";
import {useEffect} from "react";
import GithubLogo from "../../assets/github.svg";

export const HomePage = () => {
    useEffect(() => {}, [])

    return (
        <div className="homePageContainer">
            <div className="titleContainer">
                <p className="siteTitle">Pokerdle</p>
            </div>
            <div className="gameModeButtonContainer">
                <Link to={"/modes/classic"}>
                    <button className={"gameModeButton"}>Classic</button>
                </Link>
                <Link to={"/modes/lives"}>
                    <button className={"gameModeButton"}>Lives</button>
                </Link>
            </div>
            <div className="footer">
                <a className="githubSvg" href="https://github.com/ncjr1" target="_blank" rel="noopener noreferrer">
                    <img src={GithubLogo} alt="GitHub Logo"/>
                    <p className="footerText">Check out my Github!</p>
                </a>
            </div>
        </div>
    )
}