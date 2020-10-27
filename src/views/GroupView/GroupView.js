import React, {useReducer, useEffect} from 'react';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';
import GroupPostsComponent from '../../components/GroupPostsComponent/GroupPostsComponent';
import { useLocation } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule';
import { BACKEND_ADDRESS } from '../../utils/Config/Config';


/**
 * Group view
 * @return {jsx}
 */
function GroupView() {
    const location = useLocation();

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
                'а' : '';
    };

    const changeComponentActiveState = (isPosts, isMembers, isSettings) => {
        dispatch({type: 'CHANGE_ALL_FIELDS', isPosts, isMembers, isSettings});
    };

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
    } = state;

    useEffect(
        () => {
            // Подправить на id из location
            // getGroupInfo();
        }, []);

    const getGroupInfo = () => {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/group/group/39`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
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

    return (
        <div className="container">
            <div className="group-view-banner">
                <div className="group-view-banner__items">
                    <div className="group-view-banner__items__image"></div>
                    <div className="group-view-banner__items__info-container">
                        <div className="group-view-banner__items__info">
                            <div className="group-view-banner__items__info__title">{groupInfo.title}</div>
                            <div>{`${groupInfo.count} участник${ending(groupInfo.count % 10)}`}</div>
                            <div>{id}</div>
                        </div>
                        <div className="group-view-banner__items__links">
                            <div
                                className={`group-view-banner__items__links__${(componentActive.posts) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(true, false, false)}>Посты</div>
                            <div
                                className={`group-view-banner__items__links__${(componentActive.members) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, true, false)}>Участники</div>
                            <div
                                className={`group-view-banner__items__links__${(componentActive.settings) ? 'active' : 'normal'}-link`}
                                onClick={() => changeComponentActiveState(false, false, true)}>Настройки</div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="groupViewPostsContainer" className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    {componentActive.posts && (
                        <GroupPostsComponent/>
                    )}
                    {componentActive.members && (
                        <GroupMembersComponent/>
                    )}
                    {componentActive.settings && (
                        <GroupSettingsComponent/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupView;
