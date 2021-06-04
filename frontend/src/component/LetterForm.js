import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import useGetUserOtherInfo from '../customHooks/useGetUserOtherInfo'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200
        },
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function LetterForm4() {
    const classes = useStyles();
    const [username, setUsername] = useState('')
    const [wish, setWish] = useState('')
    const [getUserOtherInfo, userOtherInfo, message, emailPreviewURL] = useGetUserOtherInfo('')
    const [open, setOpen] = useState(false)
    const isFieldEmpty = (username === '' || wish === '')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!isFieldEmpty) {
            getUserOtherInfo(username, wish)
            handleClickOpen()
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <h1>A letter to Santa</h1>
            <h2>Ho ho ho, what you want for Christmas?</h2>
            <div>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={event => handleSubmit(event)}>
                    <div>
                        <TextField
                            id="outlined-required"
                            label="Username"
                            placeholder="charlie.brown"
                            variant="outlined"
                            helperText='Required*'
                            onChange={event => setUsername(event.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            id="outlined-required"
                            placeholder="Gift!"
                            label="What do you want for christmas?"
                            variant="outlined"
                            rows={4}
                            multiline
                            helperText='Required*'
                            onChange={event => setWish(event.target.value)}
                        />
                    </div>
                    <div>
                        <Button className={classes.button} size="small" variant="contained" color="primary" type="submit">
                            Send Letter
                            </Button>
                    </div>
                    <div><p>Email preview link will be displayed here once message is sent. Wait for a moment. Thank you.</p>
                        {emailPreviewURL === '' || userOtherInfo.age >= 10 ? '' : <a href={emailPreviewURL} target="_blank" rel="noreferrer"> Click here</a>} </div>
                </form>
            </div>

            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <h1>Hi {username},</h1>
                            <h1 style={{ color: userOtherInfo.age < 10 ? "green" : "red" }}>{message}</h1>
                            <h4>Other Details:</h4>
                            <p>Birthdate: {userOtherInfo.birthdate}</p>
                            <p>Age:{userOtherInfo.age}</p>
                            <p>Wish(es): {wish}</p>
                            <p>Address:{userOtherInfo.address}</p>
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button className={classes.button} size="small" variant="contained" onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default LetterForm4;