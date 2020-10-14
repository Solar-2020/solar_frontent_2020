import React from 'react';
import './ShowDocsComponent.css';
import docIcon from '../../../images/google-docs.png';

/**
 * Show docs component for post
 * @param {object} param0 - docs, handler for removing doc
 * @return {jsx}
 */
function ShowDocsComponent({docs, backendAddress}) {
    return (
        <div className="show-post-component__white-part__show-docs-container">
            {docs.map((doc) => (
                <div key={doc.id} className="show-post-component__white-part__show-docs-container__doc-view">
                    <img src={docIcon} alt={doc.name} className="show-post-component__white-part__show-docs-container__doc-view_img"></img>
                    <a href={`${backendAddress}/${doc.url}`} download className="show-post-component__white-part__show-docs-container__doc-view_title">{doc.name}</a>
                </div>
            ))}
        </div>
    );
}

export default ShowDocsComponent;
