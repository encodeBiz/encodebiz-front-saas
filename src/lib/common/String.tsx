import { countriesCode } from "@/config/constants";
import { fileTypeIcons } from "@/config/theme";
import { IUserMedia } from "@/domain/core/IUserMedia";

export const createSlug = (str: string) => string_to_slug(str)


/**
 * Convert string to slug
 *
 * @param {string} str
 * @returns {string}
 */
function string_to_slug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

/**
 * Truncate Text
 *
 * @param {string} str
 * @returns {string}
 */
export function truncateText(str: string, width: number = 80) {
    if (str?.length > width) {
        return str.substring(0, width) + '...';
    }

    return str;
}


export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}


export function stripe_price_format(price: number) {
    const res = `${price}`.slice(-2);
    const before = `${price}`.substring(0, `${price}`.length - 2);
    return `${before},${res}€`;
}



export function roundToTwoDecimalPlaces(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
}


export function isDecimal(number: number) {
    return number % 1 !== 0;
}

export function normalizarString(cadena: string) {
    const minusculas = cadena.toLowerCase();
    const normalizada = minusculas.normalize('NFD');
    return normalizada.replace(/[\u0300-\u036f]/g, '');
}

export const getFileIcon = (file: IUserMedia) => {
    if (file.type.startsWith('image/')) return fileTypeIcons.image;
    if (file.type.startsWith('video/')) return fileTypeIcons.video;
    if (file.type.startsWith('audio/')) return fileTypeIcons.audio;
    if (file.type.startsWith('application/pdf') ||
        file.type.startsWith('text/') ||
        file.type.includes('document')) {
        return fileTypeIcons.document;
    }
    return fileTypeIcons.default;
};

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const objectToArray = (arg: any) => {
    const arr: Array<{
        label: string,
        value: any
    }> = []
    Object.keys(arg).forEach(element => {
        arr.push({
            label: element,
            value: arg[element]
        })
    });
    return arr
}


export const ArrayToObject = (arr: Array<{
    label: string,
    value: any
}>) => {
    const object: any = {}
    arr.forEach(element => {
        Object.assign(object, { [element.label]: element.value })
    });
    return object
}


export const mapperErrorFromBack = (message: string, getCode = false): string => {
    let responseError: { message: string, code: string } = { message: '', code: '' }
    try { responseError = JSON.parse(message) }
    catch (error: any) {
        responseError = { code: error, message: message }
    }

    if (!getCode) return responseError.message as string
    else return JSON.stringify(responseError)



}

export function extractCountryCode(phoneNumber: string) {
    // Remove all non-digit characters except +
    const cleaned = '+' + phoneNumber.replace(/[^\d+]/g, '');
    // Common country code patterns
    const countryCodePatterns = [...countriesCode.map(e => '/^\/+' + e.dialCode + '(\d+)$/')]



    for (const pattern of countryCodePatterns) {
        const match = cleaned.match(pattern);
        if (match) {

            return {
                code: cleaned.replace(match[1], ''),
                phone: match[1]
            }
        }
    }


    // Fallback: extract + followed by 1-3 digits
    const fallbackMatch: any = cleaned.match(/^\+(\d{1,2})/);

    if (fallbackMatch) {
        return {
            code: fallbackMatch[1],
            phone: phoneNumber.substring(fallbackMatch[1].length)
        }
    }

    return fallbackMatch ? fallbackMatch[1] : null;
}

export function getAverage(numbers: Array<number>): number {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return 0;
    }

    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
}


export function excludeKeyOfObject(obj: any, key: string) {
    const result = { ...obj };
    delete result[key]
    return result;
}