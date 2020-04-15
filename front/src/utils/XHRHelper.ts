/**
 * Wrapper around XMLHttpRequest to request an endpoint
 */
export class Request {
    readonly url: string;

    private _timeout: number;
    private _params: string;
    private _headers: Record<string, string>;

    constructor(url: string) {
        this.url = url;
        this._timeout = 5000;
        this._params = '';
        this._headers = {};
    }

    public timeout(timeout: number): Request {
        this._timeout = timeout;
        return this;
    }

    public params(params: Record<string, string>): Request {
        this._params = "";
        for (const [key, value] of Object.entries(params)) {
            this._params += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }

        return this;
    }

    public headers(headers: Record<string, string>): Request {
        this._headers = headers;
        return this;
    }

    public request(method: string): Promise<XMLHttpRequest> {
        let req = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
            req.onreadystatechange = function () {
                if (req.readyState !== 4) {
                    return;   
                }

                if (req.status >= 200 && req.status < 300) {
                    resolve(req);
                } else {
                    reject({
                        status: req.status,
                        statusText: req.statusText
                    });
                }

            };

            req.open(method, this.url + this._params, true);

            for (const [key, value] of Object.entries(this._headers)) {
                req.setRequestHeader(key, value);
            }

            req.timeout = this._timeout;
            req.send();
        });
    }

    public async get(): Promise<string> {
        return (await this.request('GET')).responseText;
    }

    public async post(): Promise<string> {
        return (await this.request('POST')).responseText;
    }

}

/**
 * Shurtcut for the Request class
 * @param url The url to request
 * @param method The method to use (GET, POST, PATCH, DELETE, ...)
 * @param params The URL parameters
 * @param headers The header parameters
 */
export function request(url: string, method: string, params: Record<string, string> = {}, headers: Record<string, string> = {}, timeout = 5000): Promise<XMLHttpRequest> {
    return new Request(url).params(params).headers(headers).timeout(timeout).request(method);
}

/**
 * Shortcut for [[request]] that GET the given URL
 * @param url The URL to request
 * @param params The URL parameters
 * @param headers The header parameters
 * @returns The request response text
 */
export async function get(url: string, params: Record<string, string> = {}, headers: Record<string, string> = {}, timeout = 5000): Promise<string> {
    return new Request(url).params(params).headers(headers).timeout(timeout).get();
}

/**
 * Shortcut for [[request]] that GET the given URL and parse it as JSON
 * @param url The URL to request
 * @param params The URL parameters
 * @param headers The header parameters
 * @returns The request response text
 */
export async function json<T = object>(url: string, params: Record<string, string> = {}, headers: Record<string, string> = {}, timeout = 5000): Promise<T> {
    return JSON.parse(await new Request(url).params(params).headers(headers).timeout(timeout).get());
}

/**
 * Shortcut for [[request]] that POST the given URL
 * @param url The URL to request
 * @param params The URL parameters
 * @param headers The header parameters
 * @returns The request response text
 */
export async function post(url: string, params: Record<string, string> = {}, headers: Record<string, string> = {}, timeout = 5000): Promise<string> {
    return new Request(url).params(params).headers(headers).timeout(timeout).post();
}