import React, { useState, useEffect, useReducer } from 'react';
import './ShowStatistics.css';
import {okToastConfig, errToastConfig} from '../../../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchModule from '../../../../utils/API/FetchModule';
import {BACKEND_ADDRESS, CARD_BANK} from '../../../../utils/Config/Config';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

/**
 * Component with statistics
 * @param {object} param0 - payment
 * @return {jsx}
 */
function ShowStatistics({cookies, closeStat, paymentID}) {
    const [statistic, setStatistic] = useState([]);
    const [isStat, setIsStat] = useState(false);
    useEffect(
        () => {
            getStat();
        }, [paymentID]);

    function getStat() {
        // console.log('stat');
        // const responseBody = [{"payer":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"paidID":4,"paymentID":69,"message":"","requisiteType":3,"paidAt":"2020-11-25T13:35:00.349584+03:00","cost":"11","requisite":{"youMoneyAccount":{"id":17,"accountNumber":"1111111111111111","owner":281}}},{"payer":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"paidID":5,"paymentID":69,"message":"","requisiteType":3,"paidAt":"2020-11-25T14:22:07.739816+03:00","cost":"100","requisite":{"youMoneyAccount":{"id":17,"accountNumber":"1111111111111111","owner":281}}},{"payer":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"paidID":6,"paymentID":69,"message":"100","requisiteType":3,"paidAt":"2020-11-25T14:22:28.843867+03:00","cost":"1","requisite":{"youMoneyAccount":{"id":17,"accountNumber":"1111111111111111","owner":281}}}];
        // const responseBody = [];
        // setStatistic(responseBody);
        // setIsStat(true);

        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/payment/stat/${paymentID}`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    toast('Ошибка с получением данных', errToastConfig);
                };
                return response.json();
            })
            .then((responseBody) => {
                if (responseBody.payer) {
                    setStatistic(responseBody);
                    setIsStat(true);
                }
            });
    };

    return (
        <div className="show-stat__lightbox">
            <div className="show-stat__lightbox-container">
                <div className="show-stat__lightbox-container__title">
                    <div className="show-stat__lightbox-container__title__text">Статистика</div>
                    <button className="show-stat__lightbox-container__title__close-btn" onClick={() => closeStat()}/>
                </div>
                {isStat && !statistic.length ? (
                    <div className="show-stat-table_margin">Пока никто из пользователей не оставил оплату</div>
                ) : (
                    <div className="show-stat-table_margin">
                        <table className="show-stat-table" id={`table-to-xls-${paymentID}`}>
                            <tbody>
                                <tr>
                                    <th>Платильщик</th>
                                    <th>Почта</th>
                                    <th>Сумма</th>
                                    <th>Дата</th>
                                </tr>
                                {statistic.map((elem, index) => (
                                    <tr key={index}>
                                        <td>{`${elem.payer.name} ${elem.payer.surname}`}</td>
                                        <td>{elem.payer.email}</td>
                                        <td>{elem.cost}</td>
                                        <td>{elem.paidAt.split('T')[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                        className="show-stat-table__save-btn"
                        table={`table-to-xls-${paymentID}`}
                        filename={`tablexls-${paymentID}`}
                        sheet={`PayTogether-${paymentID}`}
                        buttonText="Скачать .xls"/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShowStatistics;