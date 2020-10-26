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
function GroupPostsComponent() {
    const initialState = {
        posts: [],
        lastID: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_NEW_POSTS':
                    return {...state, posts: state.posts.concat(action.value)};
                case 'SET_LAST_ID':
                    return {...state, lastID: fixTime(action.value)};
                default:
                    return state
            }
        },
        initialState
    )

    const {
        posts,
        lastID,
    } = state;

    function addNewPosts(value) {
        dispatch({type: 'SET_NEW_POSTS', value});
    }

    function addLastId(value) {
        dispatch({type: 'SET_LAST_ID', value});
    }

    useEffect(
        () => {
            getData(getNowTime());
        }, []);

    // 2020-10-14T15%3A43%3A17.541428%2B03%3A00
    // 2020-10-14T15:43:17.541428+03:00
    function getData(time) {
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
                    addNewPosts(responseBody);

                    if (responseBody.length > 0) {
                        addLastId(responseBody[responseBody.length - 1].publishDate)
                    }
                }
            });
    };

    return (
        <div>
            {/* {lastID}
            <button onClick={() => getData(lastID)}>получить данные</button> */}
            <CreatePost/>
            {posts.map((elem) => (
                <div key={elem.id}>
                    <ShowPostComponent data={elem}/>
                </div>
            ))}
            <ShowPostComponent data={data}/>
        </div>
    );
}

export default GroupPostsComponent;