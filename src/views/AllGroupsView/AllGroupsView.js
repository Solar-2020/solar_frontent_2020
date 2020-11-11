import React, {useEffect, useReducer} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';
import { Link } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, okToastConfig, errToastConfig} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {searchGroup} from '../../utils/search';
import searchImg from '../../images/search-glass.svg';
import groupImg from '../../images/group.svg';

/**
 * all groups view
 * @return {jsx}
 */
function AllGroupsView({cookies}) {
    const initialState = {
        allGroups: {isGroup: false, value: 0},
        groups: [],
        searchGroups: [],
        ifSearch: false,
        noLength: false,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        allGroups,
        groups,
        searchGroups,
        ifSearch,
        noLength,
    } = state;

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const changeAllGroups = (value) => {
        changeField('allGroups', {isGroup: true, value: value});
    };

    const changeSearch = (value) => {
        (value.trim()) ? changeField('ifSearch', true) : changeField('ifSearch', false);
    
        changeField('searchGroups', searchGroup(value.trim().toLowerCase(), groups));
    };

    useEffect(() => {
        getGroupList();
    }, [allGroups.value]);

    function getGroupList() {
        // const data = [{"id":1336,"title":"Задания от яндекса","description":"Группа с заданиями от яндекса","URL":"yandextasks","avatarURL":"http://develop.nl-mail.ru/storage/photos/d1/d1f018a41401c5ae1d4179412694f0fd.png","userID":279,"userRole":{"userID":279,"groupID":0,"roleID":1,"roleName":"Создатель"},"status":1,"count":3},
        // {"id":1335,"title":"Задания от яндекса","description":"Группа с заданиями от яндекса","URL":"yandextasks","avatarURL":"http://develop.nl-mail.ru/storage/photos/d1/d1f018a41401c5ae1d4179412694f0fd.png","userID":279,"userRole":{"userID":279,"groupID":0,"roleID":1,"roleName":"Создатель"},"status":1,"count":3}];
        // changeField('groups', []);
        // changeField('searchGroups', []);
        // if (![].length) {
        //     changeField('noLength', true);
        // }

        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/group/list`,
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
                    changeField('groups', responseBody);
                    changeField('searchGroups', responseBody);
                    if (!responseBody.length) changeField('noLength', true);
                }
            });
    };

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
                'а' : '';
    };

    const createOkToast= (text) => {
        toast(text, okToastConfig);            
    };

    const createErrorToast= (text) => {
        toast(text, errToastConfig);            
    };

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <ToastContainer/>
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups} cookies={cookies} okToast={createOkToast} errToast={createErrorToast}
                    changeSearch={changeSearch}/>

                    {/* {allGroups.isGroup && (
                        <div className="all-groups-view-container__search-style__value">{allGroups.value}</div>
                    )} */}
                    <div className="all-groups-view-container__groups">
                        {searchGroups.map((elem) => (
                            <div key={elem.id} className="all-groups-view-container__groups__block">
                                <Link to={`/group/${elem.id}`} className="all-groups-view-container__groups__block__link">{elem.title}</Link>
                                <div className="all-groups-view-container__groups__block__count">{`${elem.count} участник${ending(elem.count % 10)}`}</div>
                            </div>
                        ))}
                    </div>
                    {!searchGroups.length && ifSearch && (
                        <div className="group-view-container__group-memebers-conteiner__search-empty-container">
                            <div className="group-view-container__group-memebers-conteiner__search-empty-container__circle">
                                <img alt="" src={searchImg} className="group-view-container__group-memebers-conteiner__search-empty-container__circle_img"/>
                            </div>
                            <div className="group-view-container__group-memebers-conteiner__search-empty-container__text">К сожалению, поиск не дал<br/>результатов</div>
                        </div>
                    )}
                    {noLength && !ifSearch && (
                        <div className="group-view-container__group-memebers-conteiner__search-empty-container">
                            <div className="group-view-container__group-memebers-conteiner__search-empty-container__circle">
                                <img alt="" src={groupImg} className="group-view-container__group-memebers-conteiner__search-empty-container__circle_img"/>
                            </div>
                            <div className="group-view-container__group-memebers-conteiner__search-empty-container__text">У вас нет групп<br/>Создайте!</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllGroupsView;
