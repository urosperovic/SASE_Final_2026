import { SessionManager } from "@/utils/session.manager";
import axios, {AxiosError, type AxiosResponse} from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    validateStatus: function (code) {
        return code === 200 || code === 201;
    }
});

export class UserService {
    static async login(email: string, password: string) {
        return client.post('/users/login', {email, password});
    }

    static async signUp(name: string, email: string, password: string) {
        return client.post('/users/signup', {email, password, name});
    }
    

    //get all users
    static async getAllUsers() {
        return client.get('/user');
    }

    static async getUserById(id: number) {
        return client.post('/user', {id});
    }
    static async refreshToken() {
        try {
            const refreshToken = SessionManager.getRefreshToken();
            if (!refreshToken) {
                throw new Error('Refresh token not found');
            }
    
            const response = await client.post('/users/refresh', {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
        
            if (response.data.accessToken) {
                SessionManager.saveAccessToken(response.data.accessToken);
            } else {
                throw new Error('Access token not received');
            }
        } catch (error: any) {
            console.error('Token refresh failed:', error);
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }
    
    static async getUserProfile() {
        await this.refreshToken(); 
        const access = SessionManager.getAccessToken();
        return await this.useAxios(`/users/user/${access}`);
    }



    static async useAxios(url: string, method: string = "get", body: object = {}) {
        await this.refreshToken();

        let rsp: AxiosResponse;
        

        try {
            rsp = await client.request({
                url: url,
                method: method,
                headers: {
                    'Authorization': `Bearer ${SessionManager.getAccessToken()}`
                },
                data: body
            }) as AxiosResponse;
        } catch (e) {
            console.error(e);
            rsp = (e as AxiosError).response as AxiosResponse;
        }

        if (rsp === undefined) {
            throw new Error("BACKEND_UNREACHABLE");
        }

        if (rsp.status === 403) {
            try {
                const tokenReq = await client.request({
                    url: '/users/refresh',
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${SessionManager.getRefreshToken()}`
                    }
                });

                SessionManager.saveAuth(tokenReq.data);

                return await client.request({
                    url: url,
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${SessionManager.getAccessToken()}`
                    },
                    data: body
                });
            } catch (e) {
                throw new Error('REFRESH_FAILED');
            }
        }

        if (rsp.status === 404) {
            throw new Error('NOT_FOUND');
        }

        return rsp;
    }
    
}