import React, {useState, useEffect} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';

/**
 * all groups view
 * @return {jsx}
 */
function AllGroupsView({cookies}) {
    const [allGroups, setAllGroup] = useState({isGroup: false, value: 0});

    const changeAllGroups = (value) => {
        setAllGroup({isGroup: true, value: value});
    };

    // const initialState = {
    //     groups: []
    // }

    // useEffect(() => {
    //     fetchModule.get({
    //         url: BACKEND_ADDRESS + `/group/list`,
    //         body: null,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Cookie': cookies.get('SessionToken'),
    //         },
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 changeField('isAuth', true);
    //             } else if (location.pathname !== '/') {
    //                 changeField('isAuth', false);
    //                 history.push('/login');
    //             } else {
    //                 changeField('isAuth', false);
    //             };
    //         });  
    // }, []);

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups} cookies={cookies}/>

                    {allGroups.isGroup && (
                        <div className="all-groups-view-container__search-style__value">{allGroups.value}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllGroupsView;
