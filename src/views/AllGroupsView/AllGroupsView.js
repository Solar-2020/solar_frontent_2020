import React, {useState} from 'react';
import './AllGroupsView.css';
import SearchAddGroupComponent from '../../components/SearchAddGroupComponent/SearchAddGroupComponent';

/**
 * all groups view
 */
function AllGroupsView() {
    const [allGroups, setAllGroup] = useState(false);

    const changeAllGroups = (value) => {
        setAllGroup(value);
    }

    return (
        <div className="all-groups-view-container">
            <div className="all-groups-view-container_width">
                <div className="all-groups-view-container__search-style">
                    <div className="all-groups-view-container__search-style__title">Мои группы</div>
                    <SearchAddGroupComponent changeAllGroups={changeAllGroups}/>
                </div>
            </div>
        </div>
    )
}

export default AllGroupsView;
