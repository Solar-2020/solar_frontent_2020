import React from 'react';
import { useHistory } from 'react-router-dom'
import './ShowPaymentComponent.css';
import {okToastConfig, errToastConfig} from '../../../utils/Config/Config.js';
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
    const history = useHistory();

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
                if (responseBody.error) {
                    toast('Кошелёк не активирован или не сужествует!', errToastConfig);
                };
                if (responseBody.url) {
                    history.push(`${responseBody.url}?orderId=${responseBody.orderID}`)
                };
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
