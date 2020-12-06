/**
 * Function for getting data
 * @return {string}
 */
export function getNowTime() {
    const data = new Date();
    data.setDate(data.getDate() + 1);

    let month = String(data.getMonth() + 1);
    month = (month.length < 2) ? '0' + month : month;

    let day = String(data.getDate());
    day = (day.length < 2) ? '0' + day : day;

    let str = `${data.getFullYear()}-${month}-${day}T${data.toTimeString(data.getTime).split(' ')[0]}.${data.getMilliseconds()}${data.toTimeString(data.getTime).split('GMT')[1].substr(0, 3)}:00`;
    // console.log('-----------');
    // console.log(str);
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

/**
 * Create date
 * @param {string} date
 * @param {string} time
 * @return {string}
 */
export function createNormDate(date, time) {
    const monthes = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    const dateArr = date.split('-');

    return `${dateArr[2]} ${monthes[dateArr[1] - 1]} ${dateArr[0]} ${time}`;
}
