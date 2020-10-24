import React, {useState} from 'react';

/**
 * Component with form for create answer
 * @param {object} param0 - handler
 * @return {jsx}
 */
function InterviewForm({addHandler}) {
    const [value, setValue] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();

        if (value.trim()) {
            addHandler(value.trim());
            setValue('');
        }
    };

    return (
        <div>
            <form onSubmit={submitHandler} className="create-post-component__white-part__interview-container__title__input-container__add-answer">
                <input
                    type="text"
                    placeholder="Введите новый вариант"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="create-post-component__white-part__interview-container__title__input-container__add-answer_text"
                />
            </form>
        </div>
    );
}

export default InterviewForm;
