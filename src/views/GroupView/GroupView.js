import React, {useState, useEffect} from 'react';
import CreatePost from '../../components/CreatePostComponent/CreatePost';
import GroupMembersComponent from '../../components/GroupMembersComponent/GroupMembersComponent';
import GroupSettingsComponent from '../../components/GroupSettingsComponent/GroupSettingsComponent';
import './GroupView.css';
import ShowPostComponent from '../../components/ShowPostComponent/ShowPostComponent';
import {data} from './data.js';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import {getNowTime} from '../../utils/time.js';


/**
 * Group view
 * @return {jsx}
 */
function GroupView() {
    const [postsData, setPostsData] = useState([]);
    const [groupInfo] = useState({
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

    useEffect(
        () => {
            getData(getNowTime());
            // createScroll();
    }, []);

    const changeComponentActiveState = (isPosts, isMembers, isSettings) => {
        setComponentActive({
            posts: isPosts,
            members: isMembers,
            settings: isSettings,
        });        
    };

    // 2020-10-14T15%3A43%3A17.541428%2B03%3A00
    // 2020-10-14T15:43:17.541428+03:00
    const getData = (time) => {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/posts/posts?groupID=1&limit=10&startFrom=${time}`,
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
                if (Array.isArray(responseBody)) {
                    let newArr = postsData.slice();
                    responseBody.forEach((elem) => {
                        newArr.push(elem);
                    });
                    setPostsData(newArr);
                }
            });
    };

    // const createScroll = () => {
    //     window.addEventListener("scroll", function() {
    //         if (!window.location.pathname.includes('/group/')) {
    //             window.removeEventListener("scroll", function() {});
    //             return;
    //         }
            
    //         console.log('ok');
    //         const block = document.getElementById('groupViewPostsContainer');
           
    //         let contentHeight = block.offsetHeight;      // 1) высота блока контента вместе с границами
    //         let yOffset       = window.pageYOffset;      // 2) текущее положение скролбара
    //         let window_height = window.innerHeight;      // 3) высота внутренней области окна документа
    //         let y             = yOffset + window_height;

    //         console.log(contentHeight);
    //         console.log(y);
           
    //         // если пользователь достиг конца
    //         // if (y >= contentHeight && (<any>window).lastEl != 1)
    //         // {
    //         //     // console.log('w: ', (<any>window).lastEl);
    //         //     addPins(args, 20, (<any>window).lastEl);
    //         // }
    //         if (y >= contentHeight) {
    //         }
    //     });
    // };

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

            <div id="groupViewPostsContainer" className="group-view-posts-container">
                <div className="group-view-posts-container__create-post">
                    {componentActive.posts && (
                        <div>
                            <CreatePost/>
                            {/* <button 
                                className="group-view-posts-container__create-post__button-view" 
                                onClick={() => getData()}>Получить данные</button> */}
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
