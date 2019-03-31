import transport from './Transport';
import { HttpPaths } from '../constants/HttpConstants';

export interface LoginData {
    login: string;
    password: string;
}

export interface UpdateUserData {
    avatar?: string;
    login?: string;
}

export interface SignupData {
    email: string;
    login: string;
    password: string;
}
class HttpApi {
    public loginUser = (userData: LoginData) => {
        return transport.doPost(HttpPaths.LOGIN, userData);
    }

    public updateUser = (userData: UpdateUserData) => {
        return transport.doPost(HttpPaths.UPDATE_USER, userData);
    }

    public signupUser = (userData: SignupData) => {
        return transport.doPost(HttpPaths.SIGNUP, userData);
    }

    public signoutUser = () => {
        return transport.doPost(HttpPaths.SIGNOUT);
    }

    public getUser = () => {
        return transport.doGet(HttpPaths.GET_USER);
    }
}

export const httpApi = new HttpApi();
