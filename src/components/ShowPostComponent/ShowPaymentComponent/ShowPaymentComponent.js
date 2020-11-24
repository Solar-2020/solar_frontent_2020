import React, { useState, useEffect, useReducer } from 'react';
import './ShowPaymentComponent.css';
import {okToastConfig, errToastConfig} from '../../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchModule from '../../../utils/API/FetchModule';
import {BACKEND_ADDRESS} from '../../../utils/Config/Config';

/**
 * Component with payment
 * @param {object} param0 - payment
 * @return {jsx}
 */
function ShowPaymentComponent({payment, cookies}) {
    const initialState = {
        card: [],
        phone: [],
        yoomoney: [],

        select: 1,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'ADD_ELEM':
                    return {...state, [action.field]: state[action.field].concat(action.value)};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        card,
        phone,
        yoomoney,
        select,
    } = state;

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    function changeElem(field, value) {
        dispatch({type: 'ADD_ELEM', field, value});
    };

    useEffect(
        () => {
            console.log(payment);
            if (payment.methods) {
                payment.methods.forEach((elem) => changeElem(elem.type, [elem]));
            }
        }, [payment]);

    function sendCost(message) {
        console.log(message);
        const data = {
            paymentID: payment.id,
            message: message,
        };

        fetchModule.post({
            url: BACKEND_ADDRESS + `/api/payment/pay`,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                console.log(responseBody);
                if (responseBody.error) {
                    toast('Кошелёк не активирован или не сужествует!', errToastConfig);
                };
                if (responseBody.url) {
                    window.location.href = `${responseBody.url}?orderId=${responseBody.orderID}`;
                };
            });
    };

    return (
        <div className="show-post-component__white-part__show-payment-container">
            <ToastContainer/>
            {/* <button onClick={() => {console.log(card, phone, yoomoney);}}>Посомтреть</button> */}
            {/* <div className="show-post-component__white-part__show-payment-container__title">К оплате</div>
            <div className="show-post-component__white-part__show-payment-container__requisite">{`Перевести на: ${payment.paymentAccount}`}</div>
            <div className="show-post-component__white-part__show-payment-container__cost">{`${payment.totalCost} ₽`}</div>
            <input
                className="show-post-component__white-part__show-payment-container__input"
                placeholder="Сообщение получателю.."/>
            <button onClick={() => sendCost()} className="show-post-component__white-part__show-payment-container__button">Оплатить</button> */}
            <div className="show-payment-title">К оплате: <span>{payment.paymentValue} ₽</span></div>
            <div className="show-payment-white-part">
                <div className="show-payment-white-part_padding">
                    <div className="show-payment-white-part__select-container">
                        <div className="show-payment-white-part__select-container__text">Реквизиты:</div>
                        <select className="show-payment-white-part__select-container__select" onChange={(e) => changeField('select', Number(e.target.value))}>
                            {phone.length > 0 && (
                                <option value="1">номера телефонов</option>
                            )}
                            {card.length > 0 && (
                                <option value="2">банковские карты</option>
                            )}
                            {yoomoney.length > 0 && (
                                <option value="3">кошелеки YooMoney</option>
                            )}
                        </select>
                    </div>
                    {phone.length > 0 && select === 1 && (
                        <div>
                            {phone.map((elem, index) => (
                                <div key={index} className="show-payment-white-part__phone">
                                    <div>{elem.phoneNumber}</div>
                                    <div className="show-payment-white-part__copy-img"/>
                                </div>
                            ))}
                        </div>
                    )}
                    {card.length > 0 && select === 2 && (
                        <div>Cards</div>
                    )}
                    {yoomoney.length > 0 && select === 3 && (
                        <div>
                            {yoomoney.map((elem, index) => (
                                <div key={index}>
                                    <div className="show-payment-white-part__phone">
                                        <div>{elem.yoomoneyAccount}</div>
                                        <div className="show-payment-white-part__copy-img"/>
                                    </div>
                                    <div style={{display: 'flex', marginTop: '5px'}}>
                                        <input
                                            className="show-payment-white-part__input"
                                            id={`pay_${payment.id}_${index}`}
                                            placeholder="Сообщение получателю.."/>
                                        <button onClick={() => sendCost(document.getElementById(`pay_${payment.id}_${index}`).value)} className="show-payment-white-part__input__button">Оплатить</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShowPaymentComponent;
