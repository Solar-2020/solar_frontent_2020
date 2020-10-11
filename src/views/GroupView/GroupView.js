import React, {useState} from 'react';
import CreatePost from '../../components/CreatePostComponent/CreatePost';
import './GroupView.css';


function GroupView() {
    const [groupInfo, setGroupInfo] = useState({
        title: 'Название группы',
        count: 10,
    });

    return (
        <div className="container">
            <div className="group-view-banner">
                <div className="group-view-banner__items">
                    <div className="group-view-banner__items__image"></div>
                    <div className="group-view-banner__items__info">
                        <div>{groupInfo.title}</div>
                        <div>{groupInfo.count}</div>
                    </div>
                    <div className="group-view-banner__items__links">
                        <div>Посты</div>
                        <div>Участники</div>
                        <div>Настройки</div>
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
