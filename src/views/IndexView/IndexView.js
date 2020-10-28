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
                    Сервис находится на этапе разработки, поэтому некоторые окна не совсем доработаны. Вам предлагается пройти следующий сценарий действий:
                    <div className="index-view-container__info__way">Зарегистрироваться → Создать группу → Перейти в группу → Разместить пост → Изменить данные о группе → Добавить участника в группу (при желании)</div>
                    Оставьте, пожалуйста, отзыв об удобстве использования и ориентировании по сайту: <a href="https://forms.gle/smRL27MP4NNAK93z9" target="_blank">https://forms.gle/smRL27MP4NNAK93z9</a></div>
            </div>
        </div>
    );
}

export default IndexView;