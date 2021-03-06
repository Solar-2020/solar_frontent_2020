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

    const getGroupList = () => {
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
                    (!responseBody.length) ? changeField('noLength', true) : changeField('noLength', false);
                }
            });
    };

    const ending = (count) => {
        return (/1[1-4]/.test(count) || /[0, 5-9]/.test(count % 10)) ?
        'ов' : /[2-4]/.test(count % 10) ?
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
                <div className="all-groups-view-container-search">
                    <ToastContainer/>

                    <div className="all-groups-view-container-search__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups} cookies={cookies} okToast={createOkToast} errToast={createErrorToast}
                    changeSearch={changeSearch}/>

                    <div className="all-groups-view-container-groups">
                        {searchGroups.map((elem) => (
                            <div key={elem.id} className="all-groups-view-container-groups__block">
                                <Link to={`/group/${elem.id}`} className="all-groups-view-container-groups__block-link">{elem.title}</Link>
                                <div className="all-groups-view-container-groups__block-count">{`${elem.count} участник${ending(elem.count % 100)}`}</div>
                            </div>
                        ))}
                    </div>

                    {!searchGroups.length && ifSearch && (
                        <div className="group-view-container-group-memebers-conteiner-search-empty-container">
                            <div className="group-view-container-group-memebers-conteiner-search-empty-container__circle">
                                <img alt="" src={searchImg} className="group-view-container-group-memebers-conteiner-search-empty-container__circle_img"/>
                            </div>
                            <div className="group-view-container-group-memebers-conteiner-search-empty-container__text">К сожалению, поиск не дал<br/>результатов</div>
                        </div>
                    )}

                    {noLength && !ifSearch && (
                        <div className="group-view-container-group-memebers-conteiner-search-empty-container">
                            <div className="group-view-container-group-memebers-conteiner-search-empty-container__circle">
                                <img alt="" src={groupImg} className="group-view-container-group-memebers-conteiner-search-empty-container__circle_img"/>
                            </div>
                            <div className="group-view-container-group-memebers-conteiner-search-empty-container__text">У вас нет групп<br/>Создайте!</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllGroupsView;
