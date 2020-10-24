import React, {useState} from 'react';
import './GroupMembersComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Group members component
 * @return {jsx}
 */
function GroupMembersComponent() {
    const [addUser, setAddUser] = useState({})

    const addField = (field, value) => {
        addUser[field] = value;
    };

    const clickHandle = (event) => {
        event.preventDefault();
        console.log(addUser);
    };

    return (
        <div className="group-view-container__group-memebers-conteiner">
            <div className="group-members-component">Здесь будут участники!</div>
            <div className="payment-component__payment-form margin-top__groups">
                <input
                    placeholder="Ваш email"
                    className="payment-component__payment-form__summ"
                    type="email"
                    onChange={(e) => addField('userEmail', String(e.target.value))}/>
                <select
                    className="payment-component__payment-form__list"
                    onChange={(e) => addField('role', Number(e.target.value))}>
                    <option value="1">Участник</option>
                    <option value="2">Администратор</option>
                    <option value="3">Создатель</option>
                </select>
            </div>
            <button onClick={(e) => clickHandle(e)} className="group-view-container__group-memebers-conteiner__add-button">Добавить участника</button>
        </div>
    );
}

export default GroupMembersComponent;
