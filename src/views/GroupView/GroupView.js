import React, {useState} from 'react';
import CreatePost from '../../components/CreatePostComponent/CreatePost';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';

/**
 * Group view
 * @return {jsx}
 */
function GroupView() {
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
                        <CreatePost/>
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
