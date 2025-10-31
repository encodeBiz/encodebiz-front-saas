import { codeError } from "@/config/errorLocales";
import { logout } from "../firebase/authentication/logout";


/**
 * HttpClientOptions
 *
 * @interface HttpClientOptions
 * @typedef {HttpClientOptions}
 */
interface HttpClientOptions {
  baseURL?: string;
  headers?: HeadersInit;
}


/**
 * Http client based on fetch
 *
 * @class HttpClient
 * @typedef {HttpClient}
 */
export class HttpClient {
  private baseURL: string | undefined;
  private headers: HeadersInit | undefined;

  constructor(options: HttpClientOptions = {}) {
    this.baseURL = options.baseURL;
    this.headers = options.headers || {};
  }

  /**
   * Create the full URL
   *
   * @param {string} url
   * @returns {string} full URL
   */
  private createFullURL(url: string): string {
    return this.baseURL ? `${this.baseURL}${url}` : url;
  }

  /**
   * Generic request method
   *
   * @template T
   * @param {string} method
   * @param {string} url
   * @param {?RequestInit} [options]
   * @returns {Promise<T>}
   */
  private async request<T>(
    method: string,
    url: string,
    options?: RequestInit,
    forceCache?: "force-cache" | "no-cache"
  ): Promise<T> {
    if (!forceCache) {
      forceCache = process.env.NODE_ENV ==
        "production"
        ? "force-cache"
        : "no-cache"
    }
    const fullURL = this.createFullURL(url);
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...(options?.headers || {}),
      },
      ...options,
    };

 
    

    try {
      const response = await fetch(fullURL, { ...config, cache: forceCache });

      if (!response.ok) {



        if (response.status >= 400 && response.status <= 500) {
          let responseError: { code: string; message: string; error: string, errors: Array<string> }
          const responseErrorData = await response.json()

          if (responseErrorData?.error && responseErrorData?.details && Array.isArray(responseErrorData?.details) && responseErrorData?.details.length > 0) {
            responseError = { code: responseErrorData?.details[0], message: responseErrorData?.details[0], error: responseErrorData?.details[0], errors: [] }
          } else {
            if (responseErrorData?.error && typeof responseErrorData?.error === 'string') {
              try { responseError = JSON.parse(responseErrorData?.error) }
              catch (error: any) {
                responseError = { code: responseErrorData?.code, message: responseErrorData?.message, error: error, errors: [] }
              }
            } else {
              if (responseErrorData?.message && typeof responseErrorData?.message === 'string') {
                try { responseError = JSON.parse(responseErrorData?.message) }
                catch (error: any) { responseError = { code: responseErrorData?.code, message: responseErrorData?.message, error: error, errors: [] } }
              } else {
                if (typeof responseErrorData === 'string')
                  try { responseError = JSON.parse(responseErrorData) }
                  catch (error: any) { responseError = { code: 'error', message: '', error: error, errors: [] } }
                else
                  responseError = responseErrorData
              }
            }
          }

          if (Array.isArray(responseError.errors) && responseError.errors.length > 0) {
            throw new Error(responseError.errors[0])
          }



          if (responseError.code === 'auth/invalid_token') {
            logout()
            window.location.href = "/auth/login?expiredToken=1"
          }
          if (responseError.code === 'twofactor/invalid_token') {
            logout()
            window.location.href = "/auth/login?expiredToken=1"
          }
          const lang = (this.headers as any)?.locale??'es'
          const message = codeError[lang][responseError.code];
          const messageError = message ? message : responseError.error ? responseError.error : `HTTP error! status: ${response.status}`

          throw new Error(JSON.stringify({ message: messageError, code: responseError.code }));
        } else throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json'))
        return response?.json() as Promise<T>;
      else return {} as Promise<T>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get request
   *
   * @template T
   * @param {string} url
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  get<T>(url: string, config?: RequestInit, forceCache?: "force-cache" | "no-cache"): Promise<T> {
    return this.request<T>("GET", url, config, forceCache);
  }

  /**
   * Post request
   *
   * @template T
   * @param {string} url
   * @param {?*} [data]
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  post<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>("POST", url, {
      body: JSON.stringify(data),
      ...config,
    });
  }



  /**
   * Put request
   *
   * @template T
   * @param {string} url
   * @param {?*} [data]
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  put<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>("PUT", url, {
      body: JSON.stringify(data),
      ...config,
    });
  }
  

   /**
   * patch request
   *
   * @template T
   * @param {string} url
   * @param {?*} [data]
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  patch<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>("PATCH", url, {
      body: JSON.stringify(data),
      ...config,
    });
  }
  

  /**
   * Delete request
   *
   * @template T
   * @param {string} url
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  delete<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", url, {
      body: JSON.stringify(data),
      ...config,
    });
  }


  /**
   * Post request
   *
   * @template T
   * @param {string} url
   * @param {?*} [data]
   * @param {?RequestInit} [config]
   * @returns {Promise<T>}
   */
  async upload<T>(url: string, data?: any, headers?: any): Promise<T> {
    try {


      const response = await fetch(url, {
        method: 'POST',
        body: data,
        ...headers
      }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const responseError: { code: string; message: string; error: string, errors: Array<string> } =
            await response.json();
          if (Array.isArray(responseError.errors) && responseError.errors.length > 0) {
            throw new Error(responseError.errors[0])
          }
          const message = codeError[responseError.code];
          throw new Error(message ? message : responseError.error ? responseError.error : responseError.message ? responseError.message : `HTTP error! status: ${response.status}`);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json'))
        return response?.json() as Promise<T>;
      else return {} as Promise<T>;

    } catch (error) {
      throw error;
    }
  }
}




/**
 * Singleton instance of HttpClient
 */
const httpClientFetchInstance: HttpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_URI,
  headers: {},
});

export default httpClientFetchInstance;
