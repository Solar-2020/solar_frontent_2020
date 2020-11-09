import React, { useState } from 'react';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp, changePaymentHandler, payVal}) {
    const [typeMask, setTypeMask] = useState(1);

    const changeMaskButton = (e) => {
        setTypeMask(String(e.target.value));
        changePaymentHandler('requisite', '');
    };

    const maskMap = {
        '1': '(###) ###-##-##',
        '2': '#### #### #### ####',
    };

    const handleChangeMask = (value) => {
        value = value.replace(/[^\d]/g, '');

        changePaymentHandler('requisite', format(value, maskMap[typeMask]));
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

    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={() => delPaymentComp()}/>
            </div>
            <div className="payment-component__payment-form">
                <select
                    className="payment-component__payment-form__list"
                    onChange={(e) => changeMaskButton(e)}>
                    <option value="1">Телефон</option>
                    <option value="2">Карта</option>
                </select>
                <input
                    className="payment-component__payment-form__summ payment-component__payment-form__summ__requisite"
                    type="text"
                    placeholder={maskMap[typeMask]}
                    value={payVal}
                    onChange={(e) => handleChangeMask(String(e.target.value))}>
                </input>
            </div>
            <div className="payment-component__payment-form">
                <select
                    className="payment-component__payment-form__list"
                    onChange={(e) => changePaymentHandler('currency', Number(e.target.value))}>
                    <option value="1">Рубли</option>
                    <option value="2">Доллары</option>
                </select>
                <input
                    placeholder="Сумма"
                    className="payment-component__payment-form__summ payment-component__payment-form__summ__requisite"
                    type="number"
                    onChange={(e) => changePaymentHandler('cost', Number(e.target.value))}/>
            </div>
        </div>
    );
}

export default PaymentComponent;
