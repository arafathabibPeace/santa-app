import { useReducer } from 'react'
import useFetch from './useFetch'

const initialState = {
    userOtherInfo: {},
    message: '',
    emailPreviewURL: ''
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_OTHER_INFO':
            return {
                ...state,
                userOtherInfo: action.payload
            }
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.payload
            }
        default:
            return state

    }
}

function useGetUserOtherInfo() {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [users, profiles, sendEmail, emailPreviewURL] = useFetch()

    const formatBirthdate = (birthdate) => {
        return birthdate.substring(8, 10) + '/' + birthdate.substring(5, 7) + '/' + birthdate.substring(0, 4);
    }
    const getAge = (birthdate) => {
        let d = new Date();
        const dateNow = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
        return Math.ceil((Math.abs(new Date(dateNow) - new Date(birthdate)) / (1000 * 60 * 60 * 24) / 30) / 12);
    }

    const getUserOtherInfo = (username, wish) => {
        for (let usr of users) {
            if (usr.username === username) {
                for (let profile of profiles) {
                    if (profile.userUid === usr.uid) {
                        const birthdate = formatBirthdate(profile.birthdate)
                        const age = getAge(birthdate)
                        dispatch({ type: 'SET_OTHER_INFO', payload: { address: profile.address, birthdate: birthdate, age: age } })

                        if (age < 10) {
                            dispatch({ type: 'SET_MESSAGE', payload: 'Wish granted' })
                            sendEmail({ username: username, wish: wish, address: profile.address })
                        } else {
                            dispatch({ type: 'SET_MESSAGE', payload: 'This is for below ten year old only' })
                        }
                        break;
                    }
                }
                break;
            } else {
                dispatch({ type: 'SET_MESSAGE', payload: 'Username is not registered' })
                dispatch({ type: 'SET_OTHER_INFO', payload: {} })
            }
        }
    }

    return [getUserOtherInfo, state.userOtherInfo, state.message, emailPreviewURL]
}

export default useGetUserOtherInfo;