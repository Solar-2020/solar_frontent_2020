import React, {useReducer, useEffect} from 'react';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';
import GroupPostsComponent from '../../components/GroupPostsComponent/GroupPostsComponent';
import { useLocation } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule';
import { BACKEND_ADDRESS, okToastConfig, errToastConfig } from '../../utils/Config/Config';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Group view
 * @return {jsx}
 */
function GroupView({cookies}) {
    const location = useLocation();

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
                'а' : '';
    };

    const changeComponentActiveState = (isPosts, isMembers, isSettings) => {
        dispatch({type: 'CHANGE_ALL_FIELDS', isPosts, isMembers, isSettings});
    };

    const setGroup = (value) => {
        dispatch({type: 'SET_GROUP', value});
    };

    const changeReload = () => {
        dispatch({type: 'RELOAD_GROUP', value: !reloadGroup});
    }

    const initialState = {
        componentActive: {
            posts: true,
            members: false,
            settings: false,
        },
        groupInfo: {
            title: 'Название группы',
            count: 10,
        },
        id: location.pathname.split('/')[2],
        group: {},
        reloadGroup: false,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_ALL_FIELDS':
                    return {...state, componentActive: {
                        posts: action.isPosts,
                        members: action.isMembers,
                        settings: action.isSettings,
                    }};
                case 'SET_GROUP':
                    return {...state, group: action.value};
                case 'RELOAD_GROUP':
                    return {...state, reloadGroup: action.value};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        componentActive,
        groupInfo,
        id,
        group,
        reloadGroup
    } = state;

    useEffect(
        () => {
            // Подправить на id из location
            getGroupInfo();
        }, [reloadGroup]);

    const getGroupInfo = () => {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/group/group/${id}`,
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
                console.log(responseBody);
                if (responseBody.id) {
                    setGroup(responseBody);
                }
            });
    };

    // useEffect(
    //     () => {
    //         // console.log('fff');
    //         window.addEventListener('scroll', handleScroll);

    //         return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    // const handleScroll = () => {
    //     let contentHeight = document.documentElement.offsetHeight;
    //     let yOffset       = document.documentElement.scrollTop;
    //     let window_height = window.innerHeight;
    //     let y             = yOffset + window_height;

    //     if (Math.trunc(y) === contentHeight) {
    //         // console.log('appp');
    //         // console.log(lastId);
    //         // getData(fixTime(lastId));
    //     }
    // };

    const createOkToast= (text) => {
        toast(text, okToastConfig);            
    };

    const createErrorToast= (text) => {
        toast(text, errToastConfig);            
    };

    return (
        <div className="container">
            <div className="group-view-banner">
                <div className="group-view-banner__items">
                    <ToastContainer/>
                    {/* <button onClick={() => createOkToast('успешно')}>Успешный тост</button>
                    <button onClick={() => createErrorToast('Не успешно')}>Неуспешный тост</button> */}
                    {group.avatarURL !== '' ? (
                        <img
                            className="group-view-banner__items__image"
                            alt="" src={group.avatarURL}/>
                    ) : (
                        <img alt="" className="group-view-banner__items__image"/>
                    )}

                    <div className="group-view-banner__items__info-container">
                        <div className="group-view-banner__items__info">
                            <div className="group-view-banner__items__info__title">{group.title}</div>
                            <div className="group-view-banner__items__info__count">{`${group.count} участник${ending(group.count % 10)}`}</div>
                            {group.description && (
                                <div className="group-view-banner__items__info_description">{group.description}</div>
                            )}
                            {/* <div>{id}</div> */}
                        </div>
                        <div className="group-view-banner__items__links">
                            <div
                                className={`group-view-banner__items__links__${(componentActive.posts) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(true, false, false)}>Посты</div>
                            <div
                                className={`group-view-banner__items__links__${(componentActive.members) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, true, false)}>Участники</div>
                            
                            {group.userRole.roleID !== 3 && (
                                <div
                                className={`group-view-banner__items__links__${(componentActive.settings) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, false, true)}>Настройки</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="groupViewPostsContainer" className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    {componentActive.posts && (
                        <GroupPostsComponent cookies={cookies} id={id} okToast={createOkToast} errToast={createErrorToast}/>
                    )}
                    {componentActive.members && (
                        <GroupMembersComponent cookies={cookies} id={id} changeReload={changeReload} okToast={createOkToast} errToast={createErrorToast}/>
                    )}
                    {componentActive.settings && (
                        <GroupSettingsComponent changeReload={changeReload} group={group} cookies={cookies} okToast={createOkToast} errToast={createErrorToast}/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupView;
