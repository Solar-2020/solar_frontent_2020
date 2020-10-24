import React from 'react';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp, changePaymentHandler}) {
    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={delPaymentComp}/>
            </div>
            <input
                className="payment-component__payment-form__summ payment-component__payment-form__summ__requisite"
                type="text"
                placeholder="Телефон или номер карты"
                onChange={(e) => changePaymentHandler('requisite', String(e.target.value))}>
            </input>
            <div className="payment-component__payment-form">
                <input
                    placeholder="Сумма"
                    className="payment-component__payment-form__summ"
                    type="number"
                    onChange={(e) => changePaymentHandler('cost', Number(e.target.value))}/>
                <select
                    className="payment-component__payment-form__list"
                    onChange={(e) => changePaymentHandler('currency', Number(e.target.value))}>
                    <option value="1">Рубли</option>
                    <option value="2">Доллары</option>
                </select>
            </div>
        </div>
    );
}

export default PaymentComponent;
