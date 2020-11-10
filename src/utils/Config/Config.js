export const BACKEND_ADDRESS = process.env.REACT_APP_BACKEND || 'http://nl-mail.ru';
export const CORS_CONST = 'cors';

export const okToastConfig = {
    position: 'top-right',
    className: 'ok-toast',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
};
export const errToastConfig = {
    position: 'top-right',
    className: 'error-toast',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
};
