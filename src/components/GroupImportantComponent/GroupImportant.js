import React, {useEffect, useReducer} from 'react';
import ShowMarkedPost from '../../components/ShowPostComponent/ShowMarkedPost';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import {getNowTime, fixTime} from '../../utils/time.js';

/**
 * Group settings component
 * @return {jsx}
 */
function GroupImportantCOmponent({cookies, id, okToast, errToast, roleID}) {
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
                case 'DELETE_POST':
                    const newPosts = state.posts.filter(elem => elem.id !== action.value);
                    return {...state, posts: newPosts};
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

    function deletePostComp(value) {
        dispatch({type: 'DELETE_POST', value});
    }

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

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [posts]);

    const handleScroll = () => {
        let contentHeight = document.documentElement.offsetHeight;
        let yOffset       = document.documentElement.scrollTop;
        let window_height = window.innerHeight;
        let y             = yOffset + window_height;

        // console.log(contentHeight);
        // console.log(y);

        if ((Math.trunc(y + 3) > contentHeight) && (posts.length > 0)) {
            // console.log(posts[posts.length - 1].publishDate);
            getData(fixTime(posts[posts.length - 1].publishDate), 'add');
        }
    };

    // 2020-10-14T15%3A43%3A17.541428%2B03%3A00
    // 2020-10-14T15:43:17.541428+03:00
    function getData(time, key) {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/posts/posts?groupID=${id}&limit=10&startFrom=${time}&mark=true`,
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
                // console.log(responseBody);
                if (Array.isArray(responseBody)) {
                    if (key === 'add') {
                        addNewPosts(responseBody.slice(1));
                    } else {
                        changeAllPosts(responseBody);
                    };
                };
            });
    };

    function deletePost(value) {
        fetchModule.post({
            url: BACKEND_ADDRESS + `/api/posts/remove?groupId=${id}&postId=${value}`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    deletePostComp(value);
                    okToast('Пост удалён');
                } else {
                    errToast('Ошибка во время удаления поста');
                }
            });
    };

    return (
        <div>
            {/* {lastID}
            <button onClick={() => getData(lastID)}>получить данные</button> */}
            {posts.map((elem) => (
                <div key={elem.id}>
                    <ShowMarkedPost data={elem} cookies={cookies} roleID={roleID} okToast={okToast} errToast={errToast} deletePost={deletePost} deletePostComp={deletePostComp}/>
                </div>
            ))}
            {!posts.length && (
                <div className="empty-field">Здесь пока пусто...</div>
            )}
        </div>
    );
}

export default GroupImportantCOmponent;
