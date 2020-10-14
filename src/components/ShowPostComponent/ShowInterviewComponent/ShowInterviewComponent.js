import React from 'react';
import './ShowInterviewComponent.css';

/**
 * Component with interview
 * @param {object} param0 - answers
 * @return {jsx}
 */
function ShowInterviewComponent({interview}) {
    return (
        <div className="show-post-component__white-part__show-interview-container">
            <div className="show-post-component__white-part__show-interview-container__title">{interview.text}</div>
            {/* {interview.answers.map((answer) => (
                <div key={answer.id} className="show-post-component__white-part__show-interview-container__answer">{answer.text}</div>
            ))} */}
        </div>
    );
}

export default ShowInterviewComponent;