import React from 'react';
import './ShowPaymentComponent.css';

/**
 * Component with payment
 * @param {object} param0 - payment
 * @return {jsx}
 */
function ShowPaymentComponent({payment}) {
    const symbol = (id) => {
        if (id === 1) return '₽';
        return '$';
    };

    return (
        <div className="show-post-component__white-part__show-payment-container">
            <div className="show-post-component__white-part__show-payment-container__title">К оплате</div>
            <div className="show-post-component__white-part__show-payment-container__requisite">{`Перевести на: ${payment.requisite}`}</div>
            <div className="show-post-component__white-part__show-payment-container__cost">{`${payment.cost} ${symbol(payment.currency)}`}</div>
            <button className="show-post-component__white-part__show-payment-container__button">Оплатить</button>
        </div>
    );
}

export default ShowPaymentComponent;
