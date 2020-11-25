import React, { useReducer } from 'react';
import {CARD_BANK} from '../../../utils/Config/Config';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp, changePaymentHandler, paymentArrays, deleteElem, changeValue}) {
    const initialState = {
        phone: '',

        cardNumber: '',
        cardPhone: '',
        cardBank: '',
        cardBankLogo: '',
        style: {
            backgroundColor: '',
            color: '',
        },

        youMoney: '',

        error: '',
        openForm: '1',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'CLEAN_FORM':
                    return {...initialState};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        phone,
        cardNumber,
        cardPhone,
        cardBank,
        cardBankLogo,
        style,
        youMoney,
        error,
        openForm,
    } = state;

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const cleanForm = () => {
        dispatch({type: 'CLEAN_FORM'});
    }

    const maskMap = {
        '1': '(###) ###-##-##',
        '2': '#### #### #### ####',
        '3': '################',
    };

    const handleChangeMask = (value, maskId, field) => {
        value = value.replace(/[^\d]/g, '');

        changeField(field, format(value, maskMap[maskId]));
    };

    const format = (value, mask) => {
        let i = 0;
        let lastIndex = -1;

        const filledMask = mask.replace(/#/g, (_, j) => {
            if (i >= value.length) {
                return '#';
            }

            lastIndex = j;
            return value[i++];
        });
        return filledMask.substring(0, lastIndex + 1);
    };

    const fixSum = (e) => {
        e.target.value = e.target.value.slice(0, 4);
    };

    const selectChange = (value) => {
        cleanForm();
        changeField('openForm', value);
        changeField('error', '');
    };

    const addElemsForm = () => {
        let flag = false;

        switch(openForm) {
            case '1':
                if (phone.trim().length < 15) {
                    changeField('error', 'Телефон должен быть заполнен');
                    break;
                }
                changeField('error', '');
                flag = true;
                changePaymentHandler('phones', Array(phone));
                break;
            case '2':
                const data = {
                    cardNumber,
                    cardPhone,
                    cardBank,
                    cardBankLogo,
                    style,
                };

                if (data.cardNumber.trim().length < 19) {
                    changeField('error', 'Номер карты должен быть заполнен');
                    break;
                }
                changeField('error', '');
                flag = true;
                changePaymentHandler('cards', Array(data));
                break;
            case '3':
                if (youMoney.trim().length < 15) {
                    changeField('error', 'Номер кошелька должен быть заполнен');
                    break;
                }
                changeField('error', '');
                flag = true;
                changePaymentHandler('moneys', Array(youMoney));
                break;
            default:
                break;
        };
        if (flag) cleanForm();
    };

    const cardInput = (value) => {
        if (value.length === 7 || value.length === 6) {
            fetch(`https://api.cardinfo.online?input=${value.replace(' ', '')}&apiKey=${CARD_BANK}&fields=bankNameLocal,formBankLogoSmallSvg,formBackgroundColor,formTextColor`)
                .then((response) => {
                    return response.json()
                }).then((data) => {
                    changeField('cardBank', data.bankNameLocal);
                    changeField('cardBankLogo', data.formBankLogoSmallSvg);
                    changeField('style', {
                        backgroundColor: data.formBackgroundColor,
                        color: data.formTextColor,
                    });
                }).catch(function(error) {
                    console.error(error)
                });
        } else if (value.length < 6) {
            changeField('cardBank', initialState.cardBank);
            changeField('cardBankLogo', initialState.cardBankLogo);
            changeField('style', {
                backgroundColor: initialState.backgroundColor,
                color: initialState.color,
            });
        };
    };

    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={() => delPaymentComp()}/>
            </div>
            <div>
                {/* <div className="payment-component__payment-form">
                    <div className="payment-component__payment-form__list payment-component__payment-form__list_flex">Номер YouMoney</div>
                    <input
                        className="payment-component__payment-form__summ payment-component__payment-form__summ__requisite"
                        type="text"
                        placeholder={maskMap[typeMask]}
                        value={payVal}
                        onChange={(e) => handleChangeMask(String(e.target.value))}>
                    </input>
                </div>
                <div className="payment-component__payment-form">
                    <div className="payment-component__payment-form__list payment-component__payment-form__list_flex"> Сумма к оплате [₽]</div>
                    <input
                        placeholder="Сумма"
                        className="payment-component__payment-form__summ payment-component__payment-form__summ__requisite"
                        type="number"
                        onInput={(e) => fixSum(e)}
                        onChange={(e) => changePaymentHandler('totalCost', Number(e.target.value))}/>
                </div> */}
                <input
                    placeholder="Сумма к оплате"
                    className="payment-component__payment-form__summ payment-component__card-arrays__title_margin"
                    type="number"
                    style={{marginTop: 0}}
                    onInput={(e) => fixSum(e)}
                    onChange={(e) => changeValue('paymentValue', Number(e.target.value))}/>

                {paymentArrays.phones.length > 0 && (
                    <div className="payment-component__card-arrays__title_margin">
                        <div className="payment-component__card-arrays__title">Номера телефонов</div>
                        {paymentArrays.phones.map((elem, index) => (
                            <div key={index}>
                                <input className="payment-component__payment-form__summ" value={elem} disabled/>
                                <button className="payment-component__title-close__close-btn payment-component__title-close__close-btn_margin" onClick={() => deleteElem('phones', index)}/>
                            </div>
                        ))}
                    </div>
                )}
                {paymentArrays.cards.length > 0 && (
                    <div className="payment-component__card-arrays__title_margin">
                        <div className="payment-component__card-arrays__title">Банковские карты</div>
                        {paymentArrays.cards.map((elem, index) => (
                            <div key={index}
                                className="payment-component__payment-form__summ_card-margin"
                                style={{display: 'flex'}}>
                                <div
                                    style={{backgroundColor: elem.style.backgroundColor}}
                                    className="payment-component__card-elems-container payment-component__card-elems-container__card-style">
                                    {elem.cardBank && elem.cardBankLogo && (
                                        <div className="payment-component__card-symbol">
                                            <img className="payment-component__card-symbol__img" src={elem.cardBankLogo} alt=""/>
                                            <div 
                                                style={{color: elem.style.color}}
                                                className="payment-component__card-symbol__text">{elem.cardBank}</div>
                                        </div>
                                    )}
                                    <input
                                        className="payment-component__payment-form__summ"
                                        value={elem.cardNumber}
                                        disabled/>
                                    {elem.cardPhone && (
                                        <input
                                            className="payment-component__payment-form__summ"
                                            value={elem.cardPhone}
                                            disabled/>
                                    )}
                                </div>
                                <button className="payment-component__title-close__close-btn payment-component__title-close__close-btn_margin" onClick={() => deleteElem('cards', index)}/>
                            </div>
                        ))}
                    </div>
                )}
                {paymentArrays.moneys. length > 0 && (
                    <div className="payment-component__card-arrays__title_margin">
                    <div className="payment-component__card-arrays__title">Номера YooMoney</div>
                    {paymentArrays.moneys.map((elem, index) => (
                        <div key={index}>
                            <input className="payment-component__payment-form__summ" value={elem} disabled/>
                            <button className="payment-component__title-close__close-btn payment-component__title-close__close-btn_margin" onClick={() => deleteElem('moneys', index)}/>
                        </div>
                    ))}
                </div>
                )}
            </div>
                
            <div className="payment-component__payment-form payment-component__border-top">
                <select
                    value={openForm}
                    className="payment-component__payment-form__list-select"
                    onChange={(e) => selectChange(e.target.value)}
                    >
                    <option value="1">Телефон</option>
                    <option value="2">Карта</option>
                    <option value="3">YooMoney</option>
                </select>
                <button className="payment-component__add-button" onClick={(e) => addElemsForm()}>Добавить</button>
            </div>
            {error && (
                <div className="payment-component__error">{error}</div>
            )}
            {openForm === '1' && (
                <input
                    className="payment-component__payment-form__summ payment-component__payment-form__summ_margin"
                    type="text"
                    placeholder={maskMap[1]}
                    value={phone}
                    onChange={(e) => handleChangeMask(String(e.target.value), 1, 'phone')}/>
            )}  
            {openForm === '2' && (
                <div
                    style={{backgroundColor: style.backgroundColor}}
                    className="payment-component__card-elems-container payment-component__card-elems-container__card-style payment-component__payment-form__summ_margin">
                    {cardBank && cardBankLogo && (
                        <div className="payment-component__card-symbol">
                            <img className="payment-component__card-symbol__img" src={cardBankLogo} alt=""/>
                            <div 
                                style={{color: style.color}}
                                className="payment-component__card-symbol__text">{cardBank}</div>
                        </div>
                    )}
                    <input
                        className="payment-component__payment-form__summ"
                        type="text"
                        placeholder={maskMap[2]}
                        value={cardNumber}
                        onInput={(e) => cardInput(String(e.target.value))}
                        onChange={(e) => handleChangeMask(String(e.target.value), 2, 'cardNumber')}/>
                    <input
                        className="payment-component__payment-form__summ"
                        type="text"
                        placeholder={maskMap[1]}
                        value={cardPhone}
                        onChange={(e) => handleChangeMask(String(e.target.value), 1, 'cardPhone')}/>
                </div>
            )}
            {openForm === '3' && (
                <input
                    className="payment-component__payment-form__summ payment-component__payment-form__summ_margin"
                    type="text"
                    placeholder={maskMap[3]}
                    value={youMoney}
                    onChange={(e) => handleChangeMask(String(e.target.value), 3, 'youMoney')}/>
            )}
            <div className="payment-component_target">* Номер кошелька на YooMoney можно узнать по <a href="https://yoomoney.ru/start" target="_blank">ссылке</a>.
            Если не пройдена верификация, то деньги Вам на счёт не смогут перевести.</div>
 
        </div>
    );
}

export default PaymentComponent;
