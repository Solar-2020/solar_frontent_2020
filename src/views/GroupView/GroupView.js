import React, {useState} from 'react';
import CreatePost from '../../components/CreatePostComponent/CreatePost';
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

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
            'а' : '';
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
                        <div className="group-view-banner__items__links__normal-link">Посты</div>
                        <div className="group-view-banner__items__links__normal-link">Участники</div>
                        <div className="group-view-banner__items__links__normal-link">Настройки</div>
                    </div>
                </div>
            </div>

            <div className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    <CreatePost/>
                </div>
            </div>
        </div>
    );
}

export default GroupView;
