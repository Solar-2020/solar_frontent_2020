import React, { useReducer } from 'react';
import {CARD_BANK} from '../../../utils/Config/Config';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp, changePaymentHandler, paymentArrays}) {
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
    };

    const addElemsForm = () => {
        console.log(paymentArrays);

        switch(openForm) {
            case '1':
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

                changePaymentHandler('cards', Array(data));
                break;
            case '3':
                changePaymentHandler('moneys', Array(youMoney));
                break;
            default:
                break;
        };
        cleanForm();
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
                {paymentArrays.phones.length > 0 && (
                    <div>Номера есть</div>
                )}
                {paymentArrays.cards.length > 0 && (
                    <div> Карты есть</div>
                )}
                {paymentArrays.moneys. length > 0 && (
                    <div>деньги есть</div>
                )}
                
                <div className="payment-component__payment-form">
                    <select
                        value={openForm}
                        className="payment-component__payment-form__list-select"
                        onChange={(e) => selectChange(e.target.value)}
                        >
                        <option value="1">Телефон</option>
                        <option value="2">Карта</option>
                        <option value="3">YouMoney</option>
                    </select>
                    <button onClick={(e) => addElemsForm()}>Добавить</button>
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
            </div>
            <div className="payment-component_target">* Номер кошелька на YouMoney можно узнать по <a href="https://yoomoney.ru/start" target="_blank">ссылке</a>.
            Если не пройдена верификация, то деньги Вам на счёт не смогут перевести.</div>
 
        </div>
    );
}

export default PaymentComponent;
