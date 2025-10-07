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
  "unavailable": "Servicio no disponible. Inténtalo de nuevo más tarde",
  "staff/email_already_exists": "Ya existe un personal de apoyo con ese correo electronico ",
  "media/invalid_dimesions": "Dimenciones no validas",
  "auth/invalid_plan": "El plan Freemium no puede crear eventos",
  "auth/unauthorized": "Acceso a recurso no autorizado",
  "staff/unauthorized": "Acceso de personal de apoyo deshabilitado o vencido",
  "media/not_found": "Archivo no encontrado",
  "staff/not_found": "Personal de apoyo no encontrado",
  'twofactor/invalid_token': "La sesión ha expirado",
  "auth/untrusted_device": "Dispositivo no confiable. Se requiere verificación adicional",
  "twofactor/invalid_code": "Código TOTP inválido",
  "user/not_found": "No existe ningún usuario con ese correo electrónico",
  "stats/range_and_groupBy_tolong": "Los datos para graficar son demasiadox extensos, intenta seleccionar un rango menor de fechas o otro tipo de agrupación"
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



        if (response.status >= 400 && response.status <= 500) {
          let responseError: { code: string; message: string; error: string, errors: Array<string> }
          const responseErrorData = await response.json()

          if (responseErrorData?.error && responseErrorData?.details && Array.isArray(responseErrorData?.details) && responseErrorData?.details.length > 0) {
            responseError = { code: responseErrorData?.details[0], message: responseErrorData?.details[0], error: responseErrorData?.details[0], errors: [] }

          } else {

            if (responseErrorData?.error && typeof responseErrorData?.error === 'string') {
              try { responseError = JSON.parse(responseErrorData?.error) }
              catch (error: any) {
                responseError = { code: responseErrorData?.error, message: responseErrorData?.error, error: error, errors: [] }
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

          if (responseError.code === 'twofactor/invalid_token') {
            logout()
            window.location.href = "/auth/login?expiredToken=1"
          }
          const message = codeError[responseError.code];
          throw new Error(message ? message : responseError.error ? responseError.error : `HTTP error! status: ${response.status}`);
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
