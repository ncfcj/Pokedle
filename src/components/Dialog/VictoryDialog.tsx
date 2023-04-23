import "./VictoryDialog.css";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

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
    
    return (<Dialog onClose={handleClose} open={open}>
        <h1>{message}</h1>
        <Button
            onClick={() => handleButtonClick(message)}
        ></Button>
    </Dialog>)
}