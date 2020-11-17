import React from 'react';
import './ShowPaymentComponent.css';
import {okToastConfig} from '../../../utils/Config/Config.js';
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
    function copyData() {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = payment.requisite;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        toast('Реквизиты скопированы', okToastConfig);  
    };

    function sendCost() {
        const data = {
            paymentID: payment.id,
            message: 'Оплата',
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
            });
    };

    return (
        <div className="show-post-component__white-part__show-payment-container">
            <ToastContainer/>
            <div className="show-post-component__white-part__show-payment-container__title">К оплате</div>
            <div className="show-post-component__white-part__show-payment-container__requisite">{`Перевести на: ${payment.paymentAccount}`}</div>
            <div className="show-post-component__white-part__show-payment-container__cost">{`${payment.totalCost} ₽`}</div>
            <button onClick={() => sendCost()} className="show-post-component__white-part__show-payment-container__button">Оплатить</button>
        </div>
    );
}

export default ShowPaymentComponent;
