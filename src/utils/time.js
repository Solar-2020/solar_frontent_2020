/**
 * Function for getting data
 * @return {string}
 */
export function getNowTime() {
    const data = new Date();
    let month = String(data.getMonth() + 1);
    month = (month.length === 1) ? '0' + month : month;

    let day = String(data.getDate());
    day = (day.length === 1) ? '0' + day : day;

    let str = `${data.getFullYear()}-${month}-${day}T${data.toTimeString(data.getTime).split(' ')[0]}.${data.getMilliseconds()}${data.toTimeString(data.getTime).split('GMT')[1].substr(0, 3)}:00`;
    str = str.replaceAll(':', '%3A');
    str = str.replaceAll('+', '%2B');
    return str;
}

/**
 * Fix time function
 * @param {string} str
 * @return {string}
 */
export function fixTime(str) {
    str = str.replaceAll(':', '%3A');
    str = str.replaceAll('+', '%2B');
    return str;
}
