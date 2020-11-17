import React, { useState } from 'react';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp, changePaymentHandler, payVal}) {
    const [typeMask, setTypeMask] = useState(3);

    const maskMap = {
        '1': '(###) ###-##-##',
        '2': '#### #### #### ####',
        '3': '################',
    };

    const handleChangeMask = (value) => {
        value = value.replace(/[^\d]/g, '');

        changePaymentHandler('paymentAccount', format(value, maskMap[typeMask]));
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

    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={() => delPaymentComp()}/>
            </div>
            <div className="payment-component_target">* Номер кошелька на YouMoney можно узнать по <a href="https://yoomoney.ru/start" target="_blank">ссылке</a></div>
            <div className="payment-component__payment-form">
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
            </div>
        </div>
    );
}

export default PaymentComponent;
