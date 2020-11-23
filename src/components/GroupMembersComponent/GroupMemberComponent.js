import React, {useReducer} from 'react';

/**
 * Group member component
 * @return {jsx}
 */
function GroupMemberComponent({elem, roleID, deleteUser, copyData}) {
    const initialState = {
        dropDown: false,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value}
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        dropDown,
    } = state;

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    }

    return (
        <div key={elem.userID} className="group-view-container__group-memebers-conteiner__members-list_person">
            <div className="show-post-component__white-part__avatar-text__avatar"></div>
            <div className="show-post-component__white-part__avatar-text__text">
                <div className="show-post-component__white-part__avatar-text__text__name">{`${elem.name} ${elem.surname} [${elem.roleName}]`}</div>
                <div className="show-post-component__white-part__avatar-text__text__data">{elem.email}</div>
            </div>
            <div className="dropdown nav__settings_margin">
                <div className="nav__settings" onClick={() => changeField('dropDown', !dropDown)}></div>
                <div className={`dropdown-content_${dropDown}`}>
                    {(elem.roleID !== 1 && roleID !== 3) && (
                        <div onClick={() => deleteUser(elem.email)}>Удалить</div>
                    )}
                    <div onClick={() => copyData(elem.email)}>Копировать почту</div>
                </div>
            </div>
        </div>
    );
}

export default GroupMemberComponent;