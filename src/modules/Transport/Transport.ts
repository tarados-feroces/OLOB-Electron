import { HTTP_DOMEN, HEADER_CONTENT_TYPE, JSON_CONTENT_TYPE, POST, GET } from '../../constants/HttpConstants';

class Transport {

    private domen = HTTP_DOMEN;

    public async doGet(url: string) {
        return this.send(GET, url);
    }

    public async doPost(url: string, data = {}) {
        return this.send(POST, url, data);
    }

    private async send(method: string, url: string = '/', data = {}) {
        const options: RequestInit = {
            method,
            mode: 'cors',
            credentials: 'include'
        };

        if (method === POST) {
            options.body = JSON.stringify(data);
            const headers = new Headers();
            headers.append(HEADER_CONTENT_TYPE, JSON_CONTENT_TYPE);

            options.headers = headers;
        }

        return fetch(`${this.domen}${url}`, options)
            .then((response) => {
                return response;
            });
    }
}

const transport = new Transport();
export default transport;
