/**
 * Search member
 * @param {string} key 
 * @param {array} elemsArray 
 */
export function searchMember(key, elemsArray) {
    return elemsArray.filter( elem => (elem.email.includes(key) || elem.name.includes(key) || elem.surname.includes(key)));
};
