
export const encodeToBase64 = (jsonData: any) => {

    const jsonString = JSON.stringify(jsonData);
    const encoded = btoa(unescape(encodeURIComponent(jsonString)));
    return encoded

};

export const decodeFromBase64 = (base64: string) => {

    return JSON.parse(decodeURIComponent(escape(atob(base64))));

};