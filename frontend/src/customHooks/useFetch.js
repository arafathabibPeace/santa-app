import { useReducer, useEffect } from 'react'
import axios from 'axios'

const initialState = {
    loading: true,
    users: [],
    profiles: [],
    emailPreviewURL: ''
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
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: true
            }
        case 'SET_EMAIL_PREVIEW_URL':
            return {
                ...state,
                emailPreviewURL: action.payload
            }
        default:
            return state;
    }
}

function useFetch() {
    const [state, dispatch] = useReducer(reducer, initialState)

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

    const sendEmail = (data) => {
        axios.post(`http://localhost:3000/sendLetter`, data)
            .then(res => {
                dispatch({ type: 'SET_EMAIL_PREVIEW_URL', payload: res.data })
            })
            .catch(err => {
                dispatch({ type: 'FETCH_ERROR' })
            })
    }

    return [state.users, state.profiles, sendEmail, state.emailPreviewURL];
}

export default useFetch