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

export const codeError: any = {
  "auth/invalid-credential":
    "Credenciales incorrectas",
  "auth/email-already-exists":
    "El correo electrónico ya está en uso. Inicie sesión o utilice un correo electrónico diferente.",
  "auth/email-already-in-use":
    "El correo electrónico ya está en uso. Inicie sesión o utilice un correo electrónico diferente.",
  "auth/invalid-email":
    "Dirección de correo electrónico no válida. Ingrese una dirección de correo electrónico válida.",
  "auth/weak-password":
    "La contraseña es demasiado débil. Elija una contraseña más segura",
  "auth/operation-not-allowed":
    "La autenticación por correo electrónico y contraseña no está habilitada. Comuníquese con el servicio de asistencia técnica",
  "auth/too-many-requests":
    "Demasiadas solicitudes. Inténtalo de nuevo más tarde",
  "auth/user-disabled":
    "Su cuenta ha sido deshabilitada. Póngase en contacto con el servicio de asistencia para obtener ayuda",
  "auth/network-request-failed":
    "Error de red. Verifique su conexión a Internet y vuelva a intentarlo",
  "auth/missing-email":
    "Se requiere correo electrónico. Por favor, introduzca su correo electrónico.",
  "auth/missing-password":
    "Se requiere contraseña. Por favor, introduzca su contraseña.",
};

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
        if (response.status === 400) {
          const responseError: { code: string; message: string; error: string, errors: Array<string> } =
            await response.json();

          if (Array.isArray(responseError.errors) && responseError.errors.length > 0) {
            throw new Error(responseError.errors[0])
          }
          const message = codeError[responseError.code];
          throw new Error(message ? message : responseError.error ? responseError.error : `HTTP error! status: ${response.status}`);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<T>;
    } catch (error) {
      console.error("Fetch error:", error);
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
  async upload<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data
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
      return response.json() as Promise<T>;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
}




/**
 * Singleton instance of HttpClient
 */
let httpClientFetchInstance: HttpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_URI,
  headers: {},
});

export default httpClientFetchInstance;
