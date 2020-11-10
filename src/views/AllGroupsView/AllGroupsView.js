import React, {useState, useEffect} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';
import { Link } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, okToastConfig, errToastConfig} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        getGroupList();
    }, []);

    useEffect(() => {
        getGroupList();
    }, [allGroups.value]);

    function getGroupList() {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/group/list`,
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
    };

    const ending = (count) => {
        return (/[0, 5-9]/.test(count)) ?
            'ов' : /[2-4]/.test(count) ?
                'а' : '';
    };

    const createOkToast= (text) => {
        toast(text, okToastConfig);            
    };

    const createErrorToast= (text) => {
        toast(text, errToastConfig);            
    };

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <ToastContainer/>
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups} cookies={cookies} okToast={createOkToast} errToast={createErrorToast}/>

                    {/* {allGroups.isGroup && (
                        <div className="all-groups-view-container__search-style__value">{allGroups.value}</div>
                    )} */}
                    <div className="all-groups-view-container__groups">
                        {groups.map((elem) => (
                            <div key={elem.id} className="all-groups-view-container__groups__block">
                                <Link to={`/group/${elem.id}`} className="all-groups-view-container__groups__block__link">{elem.title}</Link>
                                <div className="all-groups-view-container__groups__block__count">{`${elem.count} участник${ending(elem.count % 10)}`}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllGroupsView;
