import React from 'react';
import './DocsComp.css'
import docIcon from '../../../images/google-docs.png';

function DocsComponent({docs, delDocHandler}) {
    return (
        <div className="create-post-component__white-part__docs-container">
            {docs.map((doc) => (
                <div key={doc.id} className="create-post-component__white-part__docs-container__doc-view">
                    <img src={docIcon} alt={doc.title} className="create-post-component__white-part__docs-container__doc-view_img"></img>
                    <a href={doc.url} download className="create-post-component__white-part__docs-container__doc-view_title">{doc.title}</a>
                    <button 
                        className="create-post-component__white-part__docs-container__doc-view_close"
                        onClick={() => delDocHandler(doc.id)}></button>
                </div>
            ))}
        </div>
    )
}

export default DocsComponent;
