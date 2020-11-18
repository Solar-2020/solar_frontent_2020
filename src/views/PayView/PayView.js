import React, { useReducer, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {BACKEND_ADDRESS, okToastConfig, errToastConfig} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import './PayView.css';
// import fetchModule from '../../utils/API/FetchModule.js';

/**
 * Login view
 */
function PayView({cookies}) {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (/success/.test(location.pathname)) {
            toast('Оплата прошла успешно', okToastConfig);
        };

        if (/error/.test(location.pathname)) {
            toast('Оплата не прошла', errToastConfig);
        };
    }, [location]);

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
        <div className="pay-view-container">
            <div className="pay-view-container_style">
                <div className="pay-view-container_padding">
                    <ToastContainer/>
                    Здесь будет представлена ваша статистика
                </div>
            </div>
        </div>
    )
}

export default PayView;
