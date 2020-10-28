import React, {useState, useEffect} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';
import { Link } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * all groups view
 * @return {jsx}
 */
function AllGroupsView({cookies}) {
    const [allGroups, setAllGroup] = useState({isGroup: false, value: 0});

    const [groups, setGroups] = useState([]);

    const changeAllGroups = (value) => {
        setAllGroup({isGroup: true, value: value});
    };

    // const initialState = {
    //     groups: []
    // }

    useEffect(() => {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/group/list`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((responseBody) => {
                if(Array.isArray(responseBody)) {
                    setGroups(responseBody);
                }
            })
    }, []);

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups} cookies={cookies}/>

                    {allGroups.isGroup && (
                        <div className="all-groups-view-container__search-style__value">{allGroups.value}</div>
                    )}
                    <div className="groups">
                        {groups.map((elem) => (
                            <Link to={`/group/${elem.id}`}>{elem.title}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllGroupsView;
