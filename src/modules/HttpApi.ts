import transport from './Transport';
import { HttpPaths } from '../constants/HttpConstants';

export interface LoginData {
    nickname: string;
    password: string;
}

export interface RegisterData {
    email: string;
    nickname: string;
    password: string;
}
class HttpApi {
    public loginUser = (userData: LoginData) => {
        return transport.doPost(HttpPaths.LOGIN, userData);
    }

    public registerUser = (userData: RegisterData) => {
        return transport.doPost(HttpPaths.SIGNUP, userData);
    }

    public getUser = () => {
        return transport.doGet(HttpPaths.GET_USER);
    }
}

export const httpApi = new HttpApi();
