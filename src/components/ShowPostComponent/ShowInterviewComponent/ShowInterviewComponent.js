import React, {useState} from 'react';
import './ShowInterviewComponent.css';

import fetchModule from '../../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../../utils/Config/Config.js';

/**
 * Component with interview
 * @param {object} param0 - answers
 * @return {jsx}
 */
function ShowInterviewComponent({changeStatus, interview, postId}) {
    const [selectedItem, setSelectedItem] = useState([]);
    const [showAnswersRes] = useState({});

    const submitHandler = (event) => {
        event.preventDefault();

        setSelectedItem([]);
        const formElems = event.target.elements['answer'];

        for (let i = 0; i < formElems.length; i++) {
            if (formElems[i].checked) {
                selectedItem.push(Number(formElems[i].value));
            }
        }

        if (selectedItem.length) {
            sendAnswers(postId, selectedItem, interview.id);
        }
    };

    const sendAnswers = (idPost, answersArr, interviewId) => {
        const form = {
            postID: idPost,
            answers: answersArr,
        };

        // console.log('--------');
        // console.log(form);
        // let interviewOne = {"id":198,"text":"Тестовый опрос","type":1,"postID":200, status:0,"answers":[{"id":252,"text":"да","interviewID":198,"answerCount":1,"isMyAnswer":true},{"id":253,"text":"нет","interviewID":198,"answerCount":0,"isMyAnswer":false}]};
        // changeStatus([{...interviewOne, status: 1}]);

        fetchModule.post({
            url: BACKEND_ADDRESS + `/interview/result/${interviewId}`,
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
               if (responseBody.answers) {
                    changeStatus([{...responseBody, status: 1}]);
               }
            });
    };

    const createAnswersObject = (answers) => {
        let sum = 0;
        answers.forEach((elem) => {
            showAnswersRes[String(elem.id)] = elem.answerCount;
            sum += elem.answerCount;
        });

        Object.keys(showAnswersRes).forEach((key) => {
            showAnswersRes[key] = Math.trunc((showAnswersRes[key]/sum)*100);
        });

        // console.log(showAnswersRes);
        return true;
    };

    const createStyle = (persents) => ({
        'background': `linear-gradient(to right, var(--background-light-green) ${Number(persents)}%, white ${Number(persents)}%)`,
    });

    return (
        <div className="show-post-component__white-part__show-interview-container">

            {interview.text && (
                <div className="show-post-component__white-part__show-interview-container__title">{interview.text}</div>
            )}
            {interview.status === 0 ? (
                <form onSubmit={submitHandler}>
                    {interview.type === 1 ? (
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
            ) : (
                <div>
                    {createAnswersObject(interview.answers) && (
                        <div>
                            {interview.answers.map((answer) => (
                                <div key={answer.id}
                                    className="show-post-component__white-part__show-interview-container__select-answer-container"
                                    style={createStyle(showAnswersRes[String(answer.id)])}>
                                    <div className="show-post-component__white-part__show-interview-container__select-answer">{answer.text}</div>
                                    <div>{`${showAnswersRes[String(answer.id)]}%`}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ShowInterviewComponent;
