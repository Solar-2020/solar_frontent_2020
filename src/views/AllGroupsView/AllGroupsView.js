import React, {useState} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';

/**
 * all groups view
 */
function AllGroupsView() {
    const [allGroups, setAllGroup] = useState({isGroup: false, value: 0});

    const changeAllGroups = (value) => {
        setAllGroup({isGroup: true, value: value});
    }

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups}/>

                    {allGroups.isGroup && (
                        <div className="all-groups-view-container__search-style__value">{allGroups.value}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllGroupsView;
