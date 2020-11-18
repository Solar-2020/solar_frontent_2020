import React, { useReducer } from 'react';
import './AddDeleteGroupMembersComponent.css';
import fetchModule from '../../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../../utils/Config/Config.js';

/**
 * Group members component
 * @return {jsx}
 */
function AddDeleteGroupMembersComponent({cookies, id, changeReload, okToast, errToast, changeMembersList}) {
    function changeAddUserField(field, value) {
        dispatch({type: 'CHANGE_ADD_USER_FIELD', field, value});
    };

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const initialState = {
        addUser: {
            userEmail: '',
            role: 3,
        },
        addMainError: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_ADD_USER_FIELD':
                    return {...state, addUser: {...state.addUser, [action.field]: action.value}};
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'CLEAN_FORM':
                    return {...initialState};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        addUser,
        delUserEmail,
        addMainError,
    } = state;

    function closeForm() {
        dispatch({type:'CLEAN_FORM'});
    };

    function addUserAction(e) {
        e.preventDefault();

        console.log(addUser);

        const form = {
            userEmail: [addUser.userEmail],
            role: addUser.role,
            userId: [],
        };

        fetchModule.put({
            url: BACKEND_ADDRESS + `/api/group/membership/${id}`,
            body: JSON.stringify(form),
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
                    changeField('addMainError', responseBody.error);
                };

                if (responseBody.userId) {
                    // alert('Пользователь успешно добавлен!');
                    dispatch({type: 'CLEAN_FORM'});
                    okToast('Пользователь успешно добавлен');
                    changeReload();
                    changeMembersList();
                }
            });
    };

    function delUserAction(e) {
        e.preventDefault();

        console.log(delUserEmail);
    };

    return (
        <div className="add-del-group-members-component-container">
            <div className="add-del-group-members-component-title-container">
                <div className="add-del-group-members-component-title-container__title">Добавление пользователя</div>
            </div>
            {addMainError && (
                <div className="group-view-container__group-memebers-conteiner__add-user__error">{addMainError}</div>
            )}
            <div className="add-del-group-members-component__fields">
                <input
                    placeholder="Введите email"
                    className="add-del-group-members-component__fields_input"
                    type="email"
                    onChange={(e) => changeAddUserField('userEmail', String(e.target.value))}
                    value={addUser.userEmail}
                    />
                <select
                    className="add-del-group-members-component__fields_select"
                    onChange={(e) => changeAddUserField('role', Number(e.target.value))}
                    value={addUser.role}
                    >
                    <option value="3">Участник</option>
                    <option value="2">Администратор</option>
                </select>
            </div>
            <button
                className="group-view-container__group-memebers-conteiner__add-button"
                onClick={(e) => addUserAction(e)}>Добавить</button>
        </div>

    );
}

export default AddDeleteGroupMembersComponent;