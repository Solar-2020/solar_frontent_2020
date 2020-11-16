import React, {useState, useReducer, useEffect} from 'react';
import './GroupMembersComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import AddDeleteGroupMembersComponent from './AddDeleteGroupMemebersComponent/AddDeleteGroupMembersComponent';
import {searchMember} from '../../utils/search';
import '../SearchAddGroupComponent/SearchAddGroupComponent.css';
import searchImg from '../../images/search-glass.svg';

/**
 * Group members component
 * @return {jsx}
 */
function GroupMembersComponent({cookies, id, changeReload, okToast, errToast, roleID}) {
    const initialState = {
        isAddDelBtn: false,
        membersList: [],
        searchList: [],
        updateList: false,
        ifSearch: false,
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
        isAddDelBtn,
        membersList,
        updateList,
        searchList,
        ifSearch,
    } = state;

    function addDelButtonClick() {
        changeField('isAddDelBtn', !isAddDelBtn);
    };

    function closeAddDelComponent() {
        changeField('isAddDelBtn', false);
    };

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    function changeMembersList() {
        changeField('updateList', !updateList);
    }

    useEffect(() => {
        getMembersList();
    }, [updateList]);

    function getMembersList() {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/group/membership/${id}`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((responseBody) => {
                if(Array.isArray(responseBody)) {
                    changeField('membersList', responseBody);
                    changeField('searchList', responseBody);
                    changeField('ifSearch', true);
                }
            });
    };

    function deleteUser(email) {
        const data = {
            group: id,
            userEmail: email,
        };

        fetchModule.delete({
            url: BACKEND_ADDRESS + `/api/group/membership`,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((responseBody) => {
                console.log(responseBody);
            });
    };

    function copyData(email) {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = email;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        okToast(`Почта ${email} скопирована`);  
    };

    function changeSearch(value) {
        changeField('searchList', searchMember(value.trim().toLowerCase(), membersList));
    };

    return (
        <div className="group-view-container__group-memebers-conteiner">
            <div className="group-view-container__group-memebers-conteiner__search-container">
                <div className="search-add-group-component-container__form">
                    <img
                        alt=""
                        className="search-add-group-component-container__form__glass"
                        src={searchImg}/>
                    <input
                        className="search-add-group-component-container__form__input"
                        placeholder="Поиск"
                        onChange={(e) => changeSearch(e.target.value)}/>
                </div>

                {roleID !== 3 && (
                    <button
                        className="group-view-container__group-memebers-conteiner__buttons group-view-container__group-memebers-conteiner__buttons-add"
                        onClick={() => addDelButtonClick()}/>
                )}
            </div>
            {isAddDelBtn && (
                <AddDeleteGroupMembersComponent cookies={cookies} id={id} changeReload={changeReload}
                okToast={okToast} errToast={errToast} changeMembersList={changeMembersList}/>
            )}
            {searchList.map((elem) => (
                <div key={elem.userID} className="group-view-container__group-memebers-conteiner__members-list_person">
                    <div className="show-post-component__white-part__avatar-text__avatar"></div>
                    <div className="show-post-component__white-part__avatar-text__text">
                        <div className="show-post-component__white-part__avatar-text__text__name">{`${elem.name} ${elem.surname} [${elem.roleName}]`}</div>
                        <div className="show-post-component__white-part__avatar-text__text__data">{elem.email}</div>
                    </div>
                    <div className="dropdown">
                        <div className="nav__settings"></div>
                        <div className="dropdown-content">
                            {elem.roleID !== 1 && (
                                <div onClick={() => deleteUser(elem.email)}>Удалить</div>
                            )}
                            <div onClick={() => copyData(elem.email)}>Копировать почту</div>
                        </div>
                    </div>
                </div>
            ))}
            {!searchList.length && ifSearch && (
                <div className="group-view-container__group-memebers-conteiner__search-empty-container">
                    <div className="group-view-container__group-memebers-conteiner__search-empty-container__circle">
                        <img alt="" src={searchImg} className="group-view-container__group-memebers-conteiner__search-empty-container__circle_img"/>
                    </div>
                    <div className="group-view-container__group-memebers-conteiner__search-empty-container__text">К сожалению, поиск не дал<br/>результатов</div>
                </div>
            )}
        </div>
    );
}

export default GroupMembersComponent;
