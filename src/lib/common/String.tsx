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
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
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
    let res = `${price}`.slice(-2);
    let before = `${price}`.substring(0, `${price}`.length - 2);
    return `${before},${res}€`;
}



export function roundToTwoDecimalPlaces(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
}


export function isDecimal(number: number) {
    return number % 1 !== 0;
  }