import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../LoginView/LoginView.css';
// import fetchModule from '../../utils/API/FetchModule.js';
// import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Login view
 */
function PayView({cookies}) {
    const history = useHistory();

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    function setMainError(message) {
        dispatch({type: 'SET_MAIN_ERROR', message});
    };

    const initialState ={
        email: '',
        password: '',
        mainError: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'SET_MAIN_ERROR':
                    return {...state, mainError: action.message};
                case 'CLEAN_FORM':
                    return {...initialState};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        email,
        password,
        mainError,
    } = state;

    return (
        <div className="login-view-container">
           Pay page
        </div>
    )
}

export default PayView;
