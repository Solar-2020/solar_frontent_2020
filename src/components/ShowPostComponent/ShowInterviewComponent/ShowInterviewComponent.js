import React, {useState} from 'react';
import './ShowInterviewComponent.css';

/**
 * Component with interview
 * @param {object} param0 - answers
 * @return {jsx}
 */
function ShowInterviewComponent({interview}) {
    const [selectedItem, setSelectedItem] = useState(new Set());

    const changeItem = (elem) => {
        const newSet = Array.from(selectedItem);
        newSet.push(elem);
        setSelectedItem(new Set(newSet));
    };

    const createStyle = (persents) => ({
        'background': `linear-gradient(to right, var(--background-light-green) ${Number (persents)}%, white ${100 - Number(persents)}%)`,
    });

    return (
        <div className="show-post-component__white-part__show-interview-container">

            {interview.text && (
                <div className="show-post-component__white-part__show-interview-container__title">{interview.text}</div>
            )}
            {!selectedItem.size ? (
                <div>
                    {interview.answers.map((answer) => (
                        <div key={answer.id} 
                        onClick={() => changeItem(answer.id)}
                        className="show-post-component__white-part__show-interview-container__answer">{answer.text}</div>
                    ))}
                </div>
            ) : (
                <div>
                    {interview.answers.map((answer) => (
                        <div key={answer.id}
                            className="show-post-component__white-part__show-interview-container__select-answer-container"
                            style={createStyle(60)}>
                            <div key={answer.id} 
                            onClick={() => changeItem(answer.id)}
                            className="show-post-component__white-part__show-interview-container__select-answer"
                            >{answer.text}</div>
                            <div>{`60%`}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShowInterviewComponent;