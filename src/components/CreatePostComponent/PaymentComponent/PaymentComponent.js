import React from 'react';
import './PaymentComp.css';

/**
 * Component with payment
 * @param {object} param0 - handler for removing component
 * @return {jsx}
 */
function PaymentComponent({delPaymentComp}) {
    return (
        <div className="payment-component">
            <div className="payment-component__title-close">
                <div className="payment-component__title-close__title">Параметры оплаты</div>
                <button className="payment-component__title-close__close-btn" onClick={delPaymentComp}></button>
            </div>
            <div className="payment-component__payment-form"></div>
        </div>
    );
}

export default PaymentComponent;
