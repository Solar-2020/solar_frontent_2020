/**
 * Search member
 * @param {string} key 
 * @param {array} elemsArray 
 */
export function searchMember(key, elemsArray) {
    return elemsArray.filter( elem => (elem.email.toLowerCase().includes(key) || elem.name.toLowerCase().includes(key) || elem.surname.toLowerCase().includes(key)));
};

/**
 * Search group
 * @param {string} key 
 * @param {array} elemsArray 
 */
export function searchGroup(key, elemsArray) {
    return elemsArray.filter( elem => elem.title.toLowerCase().includes(key));
};
