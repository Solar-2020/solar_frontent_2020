import React, {useState, useReducer, useEffect} from 'react';
import './GroupMembersComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import AddDeleteGroupMembersComponent from './AddDeleteGroupMemebersComponent/AddDeleteGroupMembersComponent';

/**
 * Group members component
 * @return {jsx}
 */
function GroupMembersComponent({cookies, id, changeReload, okToast, errToast}) {

    const initialState = {
        isAddDelBtn: false,
        addDelBtnFlag: '',
        membersList: [],
        updateList: false,
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
        addDelBtnFlag,
        membersList,
        updateList,
    } = state;

    function addDelButtonClick(value) {
        changeField('isAddDelBtn', true);
        changeField('addDelBtnFlag', value);
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
        // console.log('get data');
        // changeField('membersList', [
        //     {
        //       "userID": 5,
        //       "groupID": 35,
        //       "roleID": 1,
        //       "roleName": "Создатель",
        //       "email": "aaa@edwef.wfe",
        //       "name": "AAA",
        //       "surname": "",
        //       "avatarURL": ""
        //     },
        //     {
        //       "userID": 8,
        //       "groupID": 35,
        //       "roleID": 3,
        //       "roleName": "Участник",
        //       "email": "aaiwdweзeijja@mail.uuu",
        //       "name": "AAA",
        //       "surname": "Bbb",
        //       "avatarURL": ""
        //     }]);
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
                }
            });
    };

    return (
        <div className="group-view-container__group-memebers-conteiner">
            <div>
                <button
                    className="group-view-container__group-memebers-conteiner__buttons group-view-container__group-memebers-conteiner__buttons-add"
                    onClick={() => addDelButtonClick('add')}/>
                <button
                    className="group-view-container__group-memebers-conteiner__buttons group-view-container__group-memebers-conteiner__buttons-del"
                    onClick={() => addDelButtonClick('del')}/>
            </div>
            {isAddDelBtn && (
                <AddDeleteGroupMembersComponent flag={addDelBtnFlag} close={closeAddDelComponent} cookies={cookies} id={id} changeReload={changeReload}
                okToast={okToast} errToast={errToast} changeMembersList={changeMembersList}/>
            )}
            {membersList.map((elem) => (
                <div key={elem.userID} className="group-view-container__group-memebers-conteiner__members-list_person">
                    <div className="show-post-component__white-part__avatar-text__avatar"></div>
                    <div className="show-post-component__white-part__avatar-text__text">
                        <div className="show-post-component__white-part__avatar-text__text__name">{`${elem.name} ${elem.surname}`}</div>
                        <div className="show-post-component__white-part__avatar-text__text__data">{elem.email}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GroupMembersComponent;
