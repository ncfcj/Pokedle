import "./VictoryDialog.css";
import Dialog from '@mui/material/Dialog';
import {Link} from "react-router-dom";

type VictoryDialogComponent = {
    open: boolean;
    onClose: (value: string) => void;
    message : string;
}

export const VictoryDialog = (props : VictoryDialogComponent) => {
    const { onClose, message, open } = props;
    
    const handleClose = () => {
        onClose(message);
    };

    const handleButtonClick = (value: string) => {
        onClose(value);
    };
    
    return (
        <Dialog onClose={handleClose} open={open}>
            <div className="messageContainer">
                <h2 className="title">{"Congratulations !"}</h2>
                <p className="message">{message}</p>
                <div className={"dialogButtonContainer"}>
                    <button
                        className="dialogButton"
                        onClick={() => handleButtonClick(message)}
                    >Try Again !</button>
                    <Link to={"/"} className={"dialogLink"}>
                        Return to Main Menu!
                    </Link>
                </div>
            </div>
        </Dialog>
    )
}