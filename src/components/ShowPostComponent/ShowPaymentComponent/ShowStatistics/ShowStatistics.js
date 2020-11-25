import React, { useState, useEffect, useReducer } from 'react';
import './ShowStatistics.css';
import {okToastConfig, errToastConfig} from '../../../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchModule from '../../../../utils/API/FetchModule';
import {BACKEND_ADDRESS, CARD_BANK} from '../../../../utils/Config/Config';

/**
 * Component with statistics
 * @param {object} param0 - payment
 * @return {jsx}
 */
function ShowStatistics({cookies, closeStat, paymentID}) {
    
    useEffect(
        () => {
            getStat();
        }, [paymentID]);

    function getStat() {
        console.log('stat');
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/payment/stat/${paymentID}`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    toast('Ошибка с получением данных', errToastConfig);
                };
                return response.json();
            })
            .then((responseBody) => {
                console.log(responseBody);
            });
    };

    return (
        <div className="show-stat__lightbox">
            <div className="show-stat__lightbox-container">
                <div className="show-stat__lightbox-container__title">
                    <div className="show-stat__lightbox-container__title__text">Статистика</div>
                    <button className="show-stat__lightbox-container__title__close-btn" onClick={() => closeStat()}/>
                </div>
            </div>
        </div>
    );
}

export default ShowStatistics;