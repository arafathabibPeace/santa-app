import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


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

const initialState = {
    loading: true,
    users: [],
    profiles: [],
    user: {}
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_USERS':
            return {
                ...state,
                users: action.payload,
                loading: false
            }
        case 'FETCH_PROFILES':
            return {
                ...state,
                profiles: action.payload,
                loading: false
            }
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            }
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

function LetterForm() {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState)
    const [username, setUsername] = useState('')
    const [wish, setWish] = useState('')
    const [message, setMessage] = useState('')
    const [previewEmail, setPreviewEmail] = useState('')

    const [open, setOpen] = useState(false)
    const isFieldEmpty = (state.username === '' || state.wish === '')

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json')
            .then(res => {
                dispatch({ type: 'FETCH_USERS', payload: res.data })
            })
            .catch((err) => {
                dispatch({ type: 'FETCH_ERROR' })
            })

        axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json')
            .then(res => {
                dispatch({ type: 'FETCH_PROFILES', payload: res.data })
            })
            .catch((err) => {
                dispatch({ type: 'FETCH_ERROR' })
            })
    }, [])

    const sendEmail = (details) => {
        axios.post(`http://localhost:3000/sendLetter`, details)
            .then(res => {
                setPreviewEmail(res.data)
            })
    }

    const getAge = (birthdate) => {
        let d = new Date();
        const dateNow = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
        return Math.ceil((Math.abs(new Date(dateNow) - new Date(birthdate)) / (1000 * 60 * 60 * 24) / 30) / 12);
    }

    const getOtherDetails = (uid) => {
        for (let profile of state.profiles) {
            if (profile.userUid === uid) {
                const birthdate = profile.birthdate.substring(8, 10) + '/' + profile.birthdate.substring(5, 7) + '/' + profile.birthdate.substring(0, 4);
                const age = getAge(birthdate)
                const details = { birthdate: birthdate, age: age, address: profile.address }
                console.log(uid, username, wish, details)
                dispatch({ type: 'SET_USER', payload: details })
                if (age < 10) {
                    setMessage('Wish granted')
                    sendEmail({ username: username, wish: wish, address: profile.address })
                    break;
                } else {
                    setMessage('This is for below ten year old only')
                }
            }
        }
    }

    const getUid = () => {
        for (let user of state.users) {
            if (user.username === username) {
                setMessage('Username is registered')
                getOtherDetails(user.uid)
                break;
            } else {
                setMessage('Username is not registered')
                dispatch({ type: 'SET_USER', payload: {} })
            }
        }

    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if (!isFieldEmpty) {
            getUid()
        }

    }

    const handleClickOpen = () => {

        if (isFieldEmpty) {
            setOpen(false);
        } else {
            setOpen(true);
        }
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
                            <Button className={classes.button} size="small" variant="contained" color="primary" type="submit" onClick={handleClickOpen}>
                                Send Letter
                            </Button>
                        </div>
                        <div>{previewEmail === '' || state.user === {} || state.user.age >= 10 ? '' : <a href={previewEmail} target="_blank" rel="noopener noreferrer">Message sent. Click here to preview email</a>}</div>
                    </div>
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
                            <h1 style={{color: state.user.age<10?"green":"red"}}>{message}</h1>
                            <h4>Other Details:</h4>
                            <p>Birthdate: {state.user.birthdate}</p>
                            <p>Age:{state.user.age}</p>
                            <p>Wish(es): {wish}</p>
                            <p>Address:{state.user.address}</p>
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

export default LetterForm;