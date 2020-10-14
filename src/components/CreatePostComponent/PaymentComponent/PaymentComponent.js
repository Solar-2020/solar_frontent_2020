import React from 'react';
import './PaymentComp.css';
import { IntegerInput, } from "react-native";

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({ delPaymentComp, changePaymentHandler }) {
    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={delPaymentComp} />
            </div>
            <div className="payment-component__payment-form">
                <IntegerInput
                    placeholder="Сумма"
                    className="payment-component__payment-form__summ"
                    type="number"
                    step="1"
                    pattern="\d+"
                    onChange={(e) => changePaymentHandler('cost', e.target.value)} />
                <select
                    className="payment-component__payment-form__list"
                    onChange={(e) => changePaymentHandler('currency', e.target.value)}>
                    <option value="1">Рубли</option>
                    <option value="2">Доллары</option>
                </select>
            </div>
        </div>
    );
}

export default PaymentComponent;
