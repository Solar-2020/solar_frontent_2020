import React from 'react';
import './IndexView.css';

/**
 * Index view
 * @return {jsx}
 */
function IndexView() {
    return (
        <div className="index-view-container">
            <div className="index-view-container_width">
                <div className="index-view-container__banner">
                    Добро пожаловать к Solar!
                </div>
                <div className="index-view-container__about">
                    <div className="index-view-container__about_right-col">
                        <div className="index-view-container__about_right-col__title">Краткое описание продукта</div>
                        <div className="index-view-container__about_right-col__text">Сервис для создания инструмента 
                        взаимодействия между членами некоторой группы (акцент делается на совместную оплату счетов, опросы и объявления)</div>
                    </div>
                    <div className="index-view-container__about_right-col">
                        <div className="index-view-container__about_right-col__title">Призван решать проблему</div>
                        <div className="index-view-container__about_right-col__text">Упрощает взаимодействие организатора со всеми 
                        членами группы, делает наглядными расходы членов группы в их личных кабинетах, упрощает оплату взносов и необходимых платежей</div>
                    </div>
                </div>
                <div className="index-view-container__info">
                    <div>Сервис находится на этапе разработки, поэтому некоторые окна не совсем доработаны. Вам предлагается пройти следующий сценарий действий: <a href="https://docs.google.com/document/d/1iizi4WEIyT2iF8-Ihlsmz5PPLypO59nzimdkrklQwm8/edit?usp=sharing" target="_blank">cценарий SolAr</a></div>
                    <div>Оставьте, пожалуйста, отзыв в форме: <a href="https://docs.google.com/forms/d/e/1FAIpQLSerEfghFlLwbv4nEBD5rLEBWsyBkITsk32iq6ec2WNEX7gUQg/viewform" target="_blank">форма SolAr</a></div>
                    <div>Ссылки, перечисленный ранее, можно найти в таблице по функциональному тестированию: <a href="https://docs.google.com/spreadsheets/d/1k-vRxIn4IPdSTk2rqfNMjt75Qx4SkT6ABxotNA-JADc/edit#gid=0" target="_blank">таблица</a> </div>
                </div>
            </div>
        </div>
    );
}

export default IndexView;