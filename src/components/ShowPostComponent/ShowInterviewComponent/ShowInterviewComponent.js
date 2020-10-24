import React, {useState} from 'react';
import './ShowInterviewComponent.css';

/**
 * Component with interview
 * @param {object} param0 - answers
 * @return {jsx}
 */
function ShowInterviewComponent({interview}) {
    const [selectedItem, setSelectedItem] = useState([]);
    const [oneType, setOneType] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();

        setSelectedItem([]);
        const formElems = event.target.elements['answer'];

        for (let i = 0; i < formElems.length; i++) {
            if (formElems[i].checked) {
                selectedItem.push(Number(formElems[i].value));
            }
        }
    };

    const createStyle = (persents) => ({
        'background': `linear-gradient(to right, var(--background-light-green) ${Number(persents)}%, white ${100 - Number(persents)}%)`,
    });

    return (
        <div className="show-post-component__white-part__show-interview-container">

            {interview.text && (
                <div className="show-post-component__white-part__show-interview-container__title">{interview.text}</div>
            )}
            <form onSubmit={submitHandler}>
                {oneType ? (
                    <div>
                        {interview.answers.map((answer) => (
                        <div key={answer.id} className="show-post-component__white-part__show-interview-container__answer">
                            <input type="radio" value={answer.id} name="answer"/>
                            <div>{answer.text} </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div>
                        {interview.answers.map((answer) => (
                            <div key={answer.id} className="show-post-component__white-part__show-interview-container__answer">
                                <input type="checkbox" value={answer.id} name="answer"/>
                                <div>{answer.text} </div>
                            </div>
                        ))}
                    </div>
                )}
               <div className="show-post-component__white-part__show-interview-container__form-button-container">
                    <input className="show-post-component__white-part__show-interview-container__form-button-container__button" type="submit" value="Отправить ответ"/>
                </div>
            </form>
            {/* {!selectedItem.size ? (
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
            )} */}
        </div>
    );
}

export default ShowInterviewComponent;
