import React, { useState, useEffect, useReducer } from 'react';
import './ShowPaymentComponent.css';
import {okToastConfig, errToastConfig} from '../../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchModule from '../../../utils/API/FetchModule';
import {BACKEND_ADDRESS, CARD_BANK} from '../../../utils/Config/Config';
import ShowStatistics from './ShowStatistics/ShowStatistics';

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
        summ: 0,
        message: '',
        addMessage: false,
        stat: false,
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
        summ,
        message,
        addMessage,
        stat,
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
                payment.methods.forEach((elem) => {
                    if (elem.type === 'phone' || elem.type === 'yoomoney') {
                        changeElem(elem.type, [elem]);
                    } else {
                        fetch(`https://api.cardinfo.online?input=${elem.cardNumber.replace(' ', '')}&apiKey=${CARD_BANK}&fields=bankNameLocal,formBankLogoSmallSvg,formBackgroundColor,formTextColor`)
                            .then((response) => {
                                return response.json()
                            }).then((data) => {
                                // Почему-то делается в 2 раза больше запросов
                                let newElem = {...elem, cardBank: data.bankNameLocal, cardBankLogo: data.formBankLogoSmallSvg, backgroundColor: data.formBackgroundColor, color: data.formTextColor};
                                changeElem(elem.type, [newElem]);
                            }).catch(function(error) {
                                console.error(error)
                            });
                    }
                });
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
                    // window.location.href = `${responseBody.url}?orderId=${responseBody.orderID}`;
                    window.open(`${responseBody.url}?orderId=${responseBody.orderID}`);
                };
            });
    };

    function copyData(email) {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = email;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        toast(`Реквизит ${email} скопирован`, okToastConfig);  
    };

    function delMessage() {
        changeField('addMessage', !addMessage);
        changeField('message', '');
    };

    function paidSumm() {
        if (summ === 0 || summ > payment.paymentValue) {
            toast('Поле суммы должно быть заполненным и не превышать указанную сумму', errToastConfig);
            return;
        };

        const reqType = {
            'phone': 2,
            'card': 1,
            'yoomoney': 3,
        }

        const data = {
            postID: payment.postID,
            groupID: payment.groupID,
            paymentID: payment.id,
            message: message,
            requisiteType: reqType[payment.methods[0].type],
            requisiteID: payment.methods[0].id,
            cost: summ,
        };

        fetchModule.post({
            url: BACKEND_ADDRESS + `/api/payment/paid`,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    toast('Данные отправлены', okToastConfig);
                    changeField('message', '');
                    changeField('addMessage', false);
                    changeField('summ', 0);
                } else {
                    toast('Ваш отчёт не был доставлен серверу', errToastConfig);
                }
            });
    };

    function closeStat() {
        changeField('stat', !stat);
    };

    return (
        <div className="show-post-component__white-part__show-payment-container">
            <ToastContainer/>
            {/* <button onClick={() => {console.log(card, phone, yoomoney);}}>Посмотреть</button> */}
            <div className="show-payment-title">К оплате: <span>{payment.paymentValue} ₽</span></div>
            {payment.paymentAccount ? (
                <div>
                    <div className="show-post-component__white-part__show-payment-container__requisite">{`Перевести на: ${payment.paymentAccount}`}</div>
                    <div style={{display: 'flex'}}>
                        <input
                            className="show-post-component__white-part__show-payment-container__input"
                            placeholder="Сообщение получателю.."
                            id={`money_${payment.id}_money`}/>
                        <button style={{height: '30px'}} onClick={() => sendCost(document.getElementById(`money_${payment.id}_money`).value)} className="show-post-component__white-part__show-payment-container__button">Оплатить</button>
                    </div>
                </div>
            ) : (
                <div style={{width: '100%'}}>
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
                                        <option value="3">кошельки YooMoney</option>
                                    )}
                                </select>
                            </div>
                            {phone.length > 0 && select === 1 && (
                                <div>
                                    {phone.map((elem, index) => (
                                        <div key={index} className="show-payment-white-part__phone">
                                            <div>{elem.phoneNumber}</div>
                                            <div className="show-payment-white-part__copy-img" onClick={() => copyData(elem.phoneNumber)}/>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {card.length > 0 && select === 2 && (
                                <div>
                                    {card.map((elem, index) => (
                                        <div key={index}
                                            className="payment-component__payment-form__summ_card-margin"
                                            style={{display: 'flex', marginTop: '10px'}}>
                                            <div
                                                style={{backgroundColor: elem.backgroundColor}}
                                                className="payment-component__card-elems-container payment-component__card-elems-container__card-style">
                                                {elem.cardBank && elem.cardBankLogo && (
                                                    <div className="payment-component__card-symbol">
                                                        <img className="payment-component__card-symbol__img" src={elem.cardBankLogo} alt=""/>
                                                        <div 
                                                            style={{color: elem.color}}
                                                            className="payment-component__card-symbol__text">{elem.cardBank}</div>
                                                    </div>
                                                )}
                                                <div className="show-payment-white-part__cards-container">
                                                    <input
                                                        className="payment-component__payment-form__summ"
                                                        value={elem.cardNumber}
                                                        disabled/>
                                                    <div className="show-payment-white-part__copy-img_white" onClick={() => copyData(elem.cardNumber)}/>
                                                </div>
                                                {elem.phoneNumber && (
                                                    <div className="show-payment-white-part__cards-container">
                                                        <input
                                                            className="payment-component__payment-form__summ"
                                                            value={elem.phoneNumber}
                                                            disabled/>
                                                        <div className="show-payment-white-part__copy-img_white" onClick={() => copyData(elem.phoneNumber)}/>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {yoomoney.length > 0 && select === 3 && (
                                <div>
                                    {yoomoney.map((elem, index) => (
                                        <div key={index}>
                                            <div className="show-payment-white-part__phone">
                                                <div>{elem.yoomoneyAccount}</div>
                                                <div className="show-payment-white-part__copy-img" onClick={(e) => copyData(elem.yoomoneyAccount)}/>
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

                    <div className="show-payment-component__paid-container">
                        <div className="show-payment-component__paid-container_row">
                            <div className="show-payment-component__paid-container__add-message_icon" onClick={() => delMessage()}/>
                            <input
                                className="show-payment-white-part__input"
                                type="number"
                                onChange={(e) => changeField('summ', Number(e.target.value))}
                                placeholder="Оплаченная сумма"/>
                            <button className="show-payment-white-part__input__button show-payment-component__paid-button"
                                onClick={() => paidSumm()}>Оплачено</button>
                        </div>
                        {addMessage && (
                            <input
                            className="show-payment-white-part__input show-payment-white-part__input_margin-top"
                            placeholder="Сообщение получателю.."
                            onChange={(e) => changeField('message', e.target.value)}/>
                        )}
                        <div className="show-payment-component__paid-stat" onClick={() => changeField('stat', !stat)}>Просмотреть статистику</div>
                        {stat && (
                            <ShowStatistics cookies={cookies} closeStat={closeStat} paymentID={payment.id}/>
                        )}
                    </div>
                </div>            
            )}
        </div>
    );
}

export default ShowPaymentComponent;
