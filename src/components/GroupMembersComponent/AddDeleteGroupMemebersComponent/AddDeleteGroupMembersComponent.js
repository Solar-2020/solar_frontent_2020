import React, { useReducer } from 'react';
import './AddDeleteGroupMembersComponent.css';

/**
 * Group members component
 * @return {jsx}
 */
function AddDeleteGroupMembersComponent({flag, close}) {
    function changeAddUserField(field, value) {
        dispatch({type: 'CHANGE_ADD_USER_FIELD', field, value});
    };

    function changeDelUserEmail(value) {
        dispatch({type: 'CHANGE_DEL_USER_FIELD', value});
    }

    const initialState = {
        addUser: {
            userEmail: '',
            role: 1,
        },
        delUserEmail: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_ADD_USER_FIELD':
                    return {...state, addUser: {...state.addUser, [action.field]: action.value}};
                case 'CHANGE_DEL_USER_FIELD':
                    return {...state, delUserEmail: action.value};
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
    } = state;

    function closeForm() {
        dispatch({type:'CLEAN_FORM'});
        close();
    };

    function addUserAction(e) {
        e.preventDefault();

        console.log(addUser);
    };

    function delUserAction(e) {
        e.preventDefault();

        console.log(delUserEmail);
    };

    return (
        <div>
            {flag === 'add' && (
                <div>
                    <div className="add-del-group-members-component-title-container">
                        <div className="add-del-group-members-component-title-container__title">Добавление пользователя</div>
                        <button 
                            className="add-del-group-members-component-title-container__close-button"
                            onClick={() => closeForm()}/>
                    </div>
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
                            <option value="1">Участник</option>
                            <option value="2">Администратор</option>
                            <option value="3">Создатель</option>
                        </select>
                    </div>
                    <button
                        className="group-view-container__group-memebers-conteiner__add-button"
                        onClick={(e) => addUserAction(e)}>Добавить</button>
                </div>
            )}
            {flag === 'del' && (
                <div>
                    <div className="add-del-group-members-component-title-container">
                        <div className="add-del-group-members-component-title-container__title">Удаление пользователя</div>
                        <button 
                            className="add-del-group-members-component-title-container__close-button"
                            onClick={() => closeForm()}/>
                    </div>
                    <div className="add-del-group-members-component__fields">
                        <input
                            placeholder="Введите email"
                            className="add-del-group-members-component__fields_input"
                            type="email"
                            onChange={(e) => changeDelUserEmail(String(e.target.value))}
                            value={delUserEmail}
                            />
                    </div>
                    <button
                        className="group-view-container__group-memebers-conteiner__add-button"
                        onClick={(e) => delUserAction(e)}>Удалить</button>
                </div>
            )}
        </div>
    );
}

export default AddDeleteGroupMembersComponent;