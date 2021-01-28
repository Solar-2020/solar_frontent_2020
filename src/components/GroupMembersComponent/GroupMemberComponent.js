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

    function Greeting({avatar}) {
        if (/photos/.test(avatar)) {
            return (<img src={avatar} className="show-post-component__white-part__avatar-text__avatar"/>);
        }
        if (!avatar.length) {
            return (<img className="show-post-component__white-part__avatar-text__avatar"/>);
        }

        const yandexIn = 'https://avatars.mds.yandex.net/get-yapic/';
        const yandexOut = '/islands-300'
        return (<img src={`${yandexIn}${avatar}${yandexOut}`} className="show-post-component__white-part__avatar-text__avatar"/>);
    };

    return (
        <div key={elem.userID} className="group-view-container__group-memebers-conteiner__members-list_person">

            {elem.userID && (
                <Greeting avatar={elem.avatarURL}/>
            )}
            
            <div className="show-post-component__white-part__avatar-text__text">
                <div className="show-post-component__white-part__avatar-text__text__name">{`${elem.name} ${elem.surname} [${elem.roleName}]`}</div>
                <div className="show-post-component__white-part__avatar-text__text__data">{elem.email}</div>
            </div>
            <div className="dropdown nav-settings_margin">
                <div className="nav-settings" onClick={() => changeField('dropDown', !dropDown)}></div>
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