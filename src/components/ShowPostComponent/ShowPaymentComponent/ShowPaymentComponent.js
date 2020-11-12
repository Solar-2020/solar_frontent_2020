import React from 'react';
import './ShowPaymentComponent.css';
import {okToastConfig} from '../../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    function copyData() {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = payment.requisite;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        toast('Реквизиты скопированы', okToastConfig);  
    };

    return (
        <div className="show-post-component__white-part__show-payment-container">
            <ToastContainer/>
            <div className="show-post-component__white-part__show-payment-container__title">К оплате</div>
            <div className="show-post-component__white-part__show-payment-container__requisite">{`Перевести на: ${payment.requisite}`}</div>
            <div className="show-post-component__white-part__show-payment-container__cost">{`${payment.cost} ${symbol(payment.currency)}`}</div>
            <button onClick={() => copyData()} className="show-post-component__white-part__show-payment-container__button">Копировать реквизиты</button>
        </div>
    );
}

export default ShowPaymentComponent;
