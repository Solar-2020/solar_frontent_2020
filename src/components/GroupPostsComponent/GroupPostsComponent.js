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
        // const responseBody = [{"id":1346,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T18:42:10.298954+03:00","groupID":1412,"text":"fefefefe","Status":"","photos":[],"files":[],"interviews":[],"payments":[],"marked":false},{"id":1345,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T18:42:07.068422+03:00","groupID":1412,"text":"fefefef","Status":"","photos":[],"files":[],"interviews":[],"payments":[],"marked":false},{"id":1344,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T18:42:03.991837+03:00","groupID":1412,"text":"ddddddddddd","Status":"","photos":[],"files":[],"interviews":[],"payments":[],"marked":false},{"id":1337,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T14:41:46.480827+03:00","groupID":1412,"text":"","Status":"","photos":[],"files":[],"interviews":[],"payments":[{"id":18,"groupID":1412,"postID":1337,"createBy":281,"totalCost":"10","paymentAccount":"410011815842486"}],"marked":true},{"id":1336,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T13:44:08.094998+03:00","groupID":1412,"text":"","Status":"","photos":[],"files":[],"interviews":[],"payments":[{"id":17,"groupID":1412,"postID":1336,"createBy":281,"totalCost":"10","paymentAccount":"4100116099561401"}],"marked":false},{"id":1334,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T12:56:05.203857+03:00","groupID":1412,"text":"","Status":"","photos":[],"files":[{"id":302,"name":"1Chertezhgotov.pdf","url":"/storage/files/1C/72506c5e58241b95538c7aa949492daf.pdf"}],"interviews":[],"payments":[],"marked":false},{"id":1333,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T12:54:03.798861+03:00","groupID":1412,"text":"","Status":"","photos":[{"id":462,"name":"picture.png","url":"/storage/photos/3c/3ca74ca02ba8cddbf4b538aa26442a9b.png"}],"files":[],"interviews":[],"payments":[],"marked":false},{"id":1329,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-17T00:06:23.668836+03:00","groupID":1412,"text":"","Status":"","photos":[],"files":[{"id":301,"name":"1Chertezhgotov.pdf","url":"/storage/files/1C/5b96c43d43a1939113c06cb8f797cce5.pdf"}],"interviews":[],"payments":[],"marked":false},{"id":1328,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-16T23:16:58.485122+03:00","groupID":1412,"text":"ddd","Status":"","photos":[],"files":[],"interviews":[],"payments":[],"marked":false},{"id":1216,"author":{"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"},"publishDate":"2020-11-15T00:40:51.570946+03:00","groupID":1412,"text":"","Status":"","photos":[{"id":454,"name":"Untitled Diagram (20).png","url":"/storage/photos/5d/5d65b0ccab80faa580a3491862406a40.png"},{"id":455,"name":"Untitled Diagram (19).png","url":"/storage/photos/e1/e168fa49136c97a853e60132c514012d.png"}],"files":[],"interviews":[],"payments":[],"marked":false}]
        // console.log(responseBody);
        // if (Array.isArray(responseBody)) {
        //     if (key === 'add') {
        //         addNewPosts(responseBody);
        //     } else {
        //         changeAllPosts(responseBody);
        //     }

        //     if (responseBody.length > 0) {
        //         addLastId(responseBody[responseBody.length - 1].publishDate);
        //     };
        // }

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

                    if (responseBody.length > 0) {
                        addLastId(responseBody[responseBody.length - 1].publishDate);
                    };
                }
            });
    };

    useEffect(
        () => {
            console.log('fff');
            window.addEventListener('scroll', handleScroll);

            return () => window.removeEventListener('scroll', handleScroll);
    }, [posts]);

    const handleScroll = () => {
        let contentHeight = document.documentElement.offsetHeight;
        let yOffset       = document.documentElement.scrollTop;
        let window_height = window.innerHeight;
        let y             = yOffset + window_height;

        console.log(contentHeight);
        console.log(y);

        if ((Math.trunc(y + 5) > contentHeight) && (posts.length > 0)) {
            console.log('appp');
            console.log('----------lastID: ', lastID);

            // getData(posts[0].publishDate, 'add');
            console.log('ddddddd');
            console.log(posts[posts.length - 1].publishDate);
            getData(fixTime(posts[posts.length - 1].publishDate), 'add');
        }
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
            <ShowPostComponent data={data} cookies={cookies} roleID={roleID} okToast={okToast} errToast={errToast}/>
        </div>
    );
}

export default GroupPostsComponent;
