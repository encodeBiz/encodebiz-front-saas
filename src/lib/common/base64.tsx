
export const encodeToBase64 = (jsonData: any) => {
    try {
        const jsonString = JSON.stringify(jsonData);
        const encoded = btoa(unescape(encodeURIComponent(jsonString)));
        return encoded
    } catch (error) {
        throw error;
    }
};

export const decodeFromBase64 = (base64: string) => {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
    } catch (error) {
        throw error;
    }
};