import React from 'react';

/**
 * Component with interview elements
 * @param {object} param0 - elements, handler for removing elements
 * @return {jsx}
 */
function InterviewElements({interviewElems, delHandler}) {
    return (
        <div>
            <div className="create-post-component__white-part__interview-container__title
            create-post-component__white-part__interview-container__title_margin">Варианты ответов</div>
            {interviewElems.map((elem) => (
                <div className="create-post-component__white-part__interview-container__title__input-container
                create-post-component__white-part__interview-container__title__input-container__elements"
                key={elem.id}
                >   
                    <div className="create-post-component__white-part__interview-container__title__input-container__elements__text">{elem.title}</div>

                    <button className="create-post-component__white-part__interview-container__title__input-container__button"
                        type="button" onClick={() => delHandler(elem.id)}></button>
                </div>
            ))}
        </div>
    );
}

export default InterviewElements;
