import React, {useState} from 'react';
import CreatePost from '../../components/CreatePostComponent/CreatePost';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';
import ShowPostComponent from '../../components/ShowPostComponent/ShowPostComponent';
import {data} from './data.js';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';


/**
 * Group view
 * @return {jsx}
 */
function GroupView() {
    const [postsData, setPostsData] = useState([]);
    const [groupInfo, setGroupInfo] = useState({
        title: 'Название группы',
        count: 10,
    });

    const [componentActive, setComponentActive] = useState({
        posts: true,
        members: false,
        settings: false,
    });

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
            'а' : '';
    };

    const changeComponentActiveState = (isPosts, isMembers, isSettings) => {
        setComponentActive({
            posts: isPosts,
            members: isMembers,
            settings: isSettings,
        });        
    };

    const getData = () => {
        fetchModule.get({
            url: BACKEND_ADDRESS + '/api/posts/posts?groupID=1&limit=10&startFro=2021-01-02',
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
                setPostsData(responseBody);
            });
    };

    return (
        <div className="container">
            <div className="group-view-banner">
                <div className="group-view-banner__items">
                    <div className="group-view-banner__items__image"></div>
                    <div className="group-view-banner__items__info">
                        <div className="group-view-banner__items__info__title">{groupInfo.title}</div>
                        <div>{`${groupInfo.count} участник${ending(groupInfo.count % 10)}`}</div>
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

            <div className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    {componentActive.posts && (
                        <div>
                            <CreatePost/>
                            <button 
                                className="group-view-posts-container__create-post__button-view" 
                                onClick={() => getData()}>Получить данные</button>
                            {postsData.map((elem) => (
                                <ShowPostComponent data={elem}/>
                            ))}
                            <ShowPostComponent data={data}/>
                        </div>
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
