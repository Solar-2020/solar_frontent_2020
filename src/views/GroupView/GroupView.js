import React, {useReducer, useEffect} from 'react';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';
import GroupPostsComponent from '../../components/GroupPostsComponent/GroupPostsComponent';
import { useLocation, useHistory } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule';
import { BACKEND_ADDRESS, okToastConfig, errToastConfig } from '../../utils/Config/Config';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroupImportantCOmponent from '../../components/GroupImportantComponent/GroupImportant';

/**
 * Group view
 * @return {jsx}
 */
function GroupView({cookies, userData}) {
    const location = useLocation();
    const history = useHistory();

    const ending = (count) => {
        return (/1[1-4]/.test(count) || /[0, 5-9]/.test(count % 10)) ?
            'ов' : /[2-4]/.test(count % 10) ?
                'а' : '';
    };

    const changeComponentActiveState = (isPosts, isImportant, isMembers, isSettings) => {
        dispatch({type: 'CHANGE_ALL_FIELDS', isPosts, isImportant, isMembers, isSettings});
    };

    const setGroup = (value) => {
        dispatch({type: 'SET_GROUP', value});
    };

    const changeReload = () => {
        dispatch({type: 'RELOAD_GROUP', value: !reloadGroup});
    }

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    }

    const initialState = {
        componentActive: {
            posts: true,
            important: false,
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
        roleID: 1,

        dropdown: false,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_ALL_FIELDS':
                    return {...state, componentActive: {
                        posts: action.isPosts,
                        important: action.isImportant,
                        members: action.isMembers,
                        settings: action.isSettings,
                    }};
                case 'SET_GROUP':
                    return {...state, group: action.value};
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
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
        reloadGroup,
        roleID,
        dropdown,
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
                } else {
                    createErrorToast('У Вас недостаточно прав для совершения данной операции! Вас перенаправят на список групп');
                    setTimeout(() => {history.push('/allgroups');}, 2400);
                }
            })
            .then((responseBody) => {
                // console.log(responseBody);
                if (responseBody.id) {
                    setGroup(responseBody);
                    changeField('roleID', responseBody.userRole.roleID);
                }
            });
    };

    const createOkToast = (text) => {
        toast(text, okToastConfig);            
    };

    const createErrorToast = (text) => {
        toast(text, errToastConfig);            
    };

    const deleteUser = () => {
        const data = {
            group: Number(id),
            userEmail: userData.email,
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
                } else {
                    createErrorToast('С вашим выходом из группы произошла ошибка, обновите страницу');
                };
            })
            .then((responseBody) => {
                if (responseBody.userEmail) {
                    createOkToast(`Вы покинули группу! Вас перенаправит на список групп`);
                    setTimeout(() => {history.push('/allgroups');}, 2400);
                };
            });
    };

    return (
        <div className="container">
            <div className="group-view-banner">
                <div className="group-view-banner-items">
                    <ToastContainer/>

                    {group.avatarURL !== '' ? (
                        <img
                            className="group-view-banner-items__image"
                            alt="" src={group.avatarURL}/>
                    ) : (
                        <img alt="" className="group-view-banner-items__image"/>
                    )}

                    <div className="group-view-banner-items-info-container">
                        <div className="group-view-banner-items_flex">
                            <div className="group-view-banner-items-info">
                                <div className="group-view-banner-items-info__title">{group.title}</div>
                                <div className="group-view-banner-items-info__count">{`${group.count} участник${ending(group.count % 100)}`}</div>
                                {group.description && (
                                    <div className="group-view-banner-items-info_description">{group.description}</div>
                                )}
                            </div>
                            {roleID !== 1 && (
                                <div className="dropdown nav-settings_margin group-view-banner-items_margin-top">
                                    <div onClick={() => changeField('dropdown', !dropdown)} className="nav-settings"></div>
                                    <div className={`dropdown-content_${dropdown}`}>
                                        <div onClick={() => deleteUser()}>Покинуть группу</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="group-view-banner-items-links">
                            <div
                                className={`group-view-banner-items-links__${(componentActive.posts) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(true, false, false, false)}>Посты</div>
                            <div
                                className={`group-view-banner-items-links__${(componentActive.important) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, true, false, false)}>Важное</div>
                            <div
                                className={`group-view-banner-items-links__${(componentActive.members) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, false, true, false)}>Участники</div>
                            
                            {roleID !== 3 && (
                                <div
                                className={`group-view-banner-items-links__${(componentActive.settings) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, false, false, true)}>Настройки</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="groupViewPostsContainer" className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    {componentActive.posts && (
                        <GroupPostsComponent cookies={cookies} id={id} okToast={createOkToast} errToast={createErrorToast} roleID={roleID} userData={userData}/>
                    )}
                    {componentActive.important && (
                        <GroupImportantCOmponent cookies={cookies} id={id} okToast={createOkToast} errToast={createErrorToast} roleID={roleID}/>
                    )}
                    {componentActive.members && (
                        <GroupMembersComponent cookies={cookies} id={id} changeReload={changeReload} okToast={createOkToast} errToast={createErrorToast} roleID={roleID}/>
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
