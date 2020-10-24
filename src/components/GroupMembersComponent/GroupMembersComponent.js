import React from 'react';
import './GroupMembersComponent.css';

/**
 * Group members component
 * @return {jsx}
 */
function GroupMembersComponent() {
    return (
        <div className="group-view-container__group-memebers-conteiner">
            <div className="group-members-component">Здесь будут участники!</div>
            <button className="group-view-container__group-memebers-conteiner__add-button">Добавить участника</button>
        </div>
    );
}

export default GroupMembersComponent;
