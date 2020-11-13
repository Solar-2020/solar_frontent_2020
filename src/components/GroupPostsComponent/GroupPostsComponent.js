import React, {useEffect, useReducer} from 'react';
import ShowPostComponent from '../../components/ShowPostComponent/ShowPostComponent';
import {data} from './data.js';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import {getNowTime, fixTime} from '../../utils/time.js';
import CreatePost from '../../components/CreatePostComponent/CreatePost';

/**
 * Group settings component
 * @return {jsx}
 */
function GroupPostsComponent({cookies, id, okToast, errToast, roleID}) {
    const initialState = {
        posts: [],
        lastID: '',
        reloadPosts: false,
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'PUSH_FRONT':
                    return {...state, posts: action.value.concat(state.posts)};
                case 'SET_NEW_POSTS':
                    return {...state, posts: state.posts.concat(action.value)};
                case 'CHANGE_ALL_POSTS':
                    return {...state, posts: action.value};
                case 'SET_LAST_ID':
                    return {...state, lastID: fixTime(action.value)};
                case 'CHANGE_RELOAD':
                    return {...state, reloadPosts: action.value};
                default:
                    return state
            }
        },
        initialState
    )

    const {
        posts,
        lastID,
        reloadPosts,
    } = state;

    function addNewPosts(value) {
        dispatch({type: 'SET_NEW_POSTS', value});
    }

    function changeAllPosts(value) {
        dispatch({type: 'CHANGE_ALL_POSTS', value});
    }

    function pushFrontNewPost(value) {
        dispatch({type: 'PUSH_FRONT', value});
    }

    function addLastId(value) {
        dispatch({type: 'SET_LAST_ID', value});
    }

    function changeReload() {
        dispatch({type: 'CHANGE_RELOAD', value: !reloadPosts});
    }

    useEffect(
        () => {
            getData(getNowTime(), 'all');
        }, [reloadPosts]);

    // 2020-10-14T15%3A43%3A17.541428%2B03%3A00
    // 2020-10-14T15:43:17.541428+03:00
    function getData(time, key) {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/posts/posts?groupID=${id}&limit=10&startFrom=${time}`,
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
                    errToast('Ошибка при получении данных');
                }
            })
            .then((responseBody) => {
                console.log(responseBody);
                if (Array.isArray(responseBody)) {
                    if (key === 'add') {
                        addNewPosts(responseBody);
                    } else {
                        changeAllPosts(responseBody);
                    }

                    // if (responseBody.length > 0) {
                    //     addLastId(responseBody[responseBody.length - 1].publishDate)
                    // }
                }
            });
    };

    return (
        <div>
            {/* {lastID}
            <button onClick={() => getData(lastID)}>получить данные</button> */}
            {roleID !== 3 && (
                <CreatePost changeReload={changeReload} cookies={cookies} id={id} okToast={okToast} errToast={errToast}/>
            )}
            {posts.map((elem) => (
                <div key={elem.id}>
                    <ShowPostComponent data={elem} cookies={cookies} roleID={roleID} okToast={okToast} errToast={errToast}/>
                </div>
            ))}
            {!posts.length && (
                <div className="empty-field">Здесь пока пусто...</div>
            )}
            {/* <ShowPostComponent data={data} cookies={cookies} roleID={roleID} okToast={okToast} errToast={errToast}/> */}
        </div>
    );
}

export default GroupPostsComponent;
