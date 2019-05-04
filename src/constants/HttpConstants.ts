export const HTTP_DOMEN: string = 'http://130.193.34.42:5000/api';
// export const HTTP_DOMEN: string = 'http://127.0.0.1:5000/api';
export const POST: string = 'POST';
export const GET: string = 'GET';
export const HEADER_CONTENT_TYPE: string = 'Content-Type';
export const JSON_CONTENT_TYPE: string = 'application/json;charset=UTF-8';
export const CORS: string = 'Access-Control-Allow-Origin';
export const CORS_VALUE: string = '130.193.34.42';
// export const CORS_VALUE: string = '127.0.0.1';

export const enum HttpPaths {
    GET_USER = '/me',
    SIGNUP = '/user/signup',
    SIGNOUT = '/user/signout',
    LOGIN = '/user/login',
    UPDATE_USER = '/user/update'
}
