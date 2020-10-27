import React, {useState, useReducer} from 'react';
import './GroupMembersComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import AddDeleteGroupMembersComponent from './AddDeleteGroupMemebersComponent/AddDeleteGroupMembersComponent';

/**
 * Group members component
 * @return {jsx}
 */
function GroupMembersComponent() {

    const initialState = {
        isAddDelBtn: false,
        addDelBtnFlag: '',
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
    } = state;

    function addDelButtonClick(value) {
        dispatch({type: 'CHANGE_FIELD', field: 'isAddDelBtn', value: true});
        dispatch({type: 'CHANGE_FIELD', field: 'addDelBtnFlag', value: value})
    };

    function closeAddDelComponent() {
        dispatch({type: 'CHANGE_FIELD', field: 'isAddDelBtn', value: false});
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
                <AddDeleteGroupMembersComponent flag={addDelBtnFlag} close={closeAddDelComponent}/>
            )}
        </div>
    );
}

export default GroupMembersComponent;
