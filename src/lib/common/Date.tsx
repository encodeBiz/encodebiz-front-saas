import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { DateTimeFormatOptions } from "next-intl";
import 'moment/locale/es';
moment.locale('es')

export type FirestoreTimestamp = {
    seconds: number;
    nanoseconds: number;
};

export const formatDay = (dd: number): any => {
    return dd < 10 ? '0' + dd : dd;
}
export const formatMonthDate = (dd: Date) => {
    return dd.toLocaleString('default', { month: 'long' })
}

export function toDateTime(secs: number) {
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

/**
 * Format date
 *
 * @export
 * @param {(Timestamp | Date | string)} str
 * @returns {string}
 */
export function format_date(str: Timestamp | Date | string | any, format: string = "LLLL"): string {
    let date: string = ""

    if (typeof str === 'string')
        date = moment(str).format(format)
    if (typeof str === 'object' && str?.seconds) {
        date = moment.unix(str?.seconds).format(format)
    }
    if (str instanceof Date) {
        date = moment((str as Date)).format(format)
    }
    if (str instanceof Timestamp) {
        date = moment((str as Timestamp).toDate()).format(format)
    }

    return date;
}

export const formatDate = async (
    timestamp: FirestoreTimestamp | Date,
    locale: string = 'es'
) => {
    // Configurar el idioma


    let jsDate: Date;
    if (timestamp instanceof Date) {
        jsDate = timestamp;
    } else {
        jsDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000);
    }
    const format = locale === 'es' ? 'D [de] MMMM [de] YYYY' : 'MMMM D, YYYY';
    return moment(jsDate).format(format)

};

export function remainTime(nextDate: Timestamp | Date | string | any): string {
    let date: Date = new Date()
    if (typeof nextDate === 'string')
        date = moment(nextDate).toDate()
    if (typeof nextDate === 'object' && nextDate?.seconds) {
        date = moment.unix(nextDate?.seconds).toDate()
    }
    if (nextDate instanceof Timestamp) {
        date = (nextDate as Timestamp).toDate()
    }

    const b = moment(date).fromNow();
    return b; // "a day ago"
}
export function diffTime(nextDate: Timestamp | Date | string | any): number {
    let date: Date = new Date()
    if (typeof nextDate === 'string')
        date = moment(nextDate).toDate()
    if (typeof nextDate === 'object' && nextDate?.seconds) {
        date = moment.unix(nextDate?.seconds).toDate()
    }
    if (nextDate instanceof Timestamp) {
        date = (nextDate as Timestamp).toDate()
    }

    const b = moment(date).diff(moment());
    return b; // "a day ago"
}


/**
 * Format date
 *
 * @export
 * @param {(Timestamp | Date | string)} str
 * @returns {string}
 */
export function format_range(range: Array<Timestamp>): string {



    let date: string = "02 - 05 Octubre"

    if (range?.length === 2) {
        const dateStart: Date = new Date(range[0]?.seconds * 1000);
        const dateEnd: Date = new Date(range[1]?.seconds * 1000);
        if (dateStart.getMonth() === dateEnd.getMonth() && dateStart.getDate() === dateEnd.getDate()) {
            date = `${formatDay(dateStart.getDate())} ${dateEnd.toLocaleString('default', { month: 'long' })}`
        } else {
            if (dateStart.getMonth() === dateEnd.getMonth()) {
                date = `${formatDay(dateStart.getDate())} - ${formatDay(dateEnd.getDate())} ${dateEnd.toLocaleString('default', { month: 'long' })}`
            } else {
                date = `${formatDay(dateStart.getDate())} ${dateStart.toLocaleString('default', { month: 'long' })} - ${formatDay(dateEnd.getDate())} ${dateEnd.toLocaleString('default', { month: 'long' })}`

            }
        }
    }
    return date;
}



export function formatDateInSpanish(date: any, extra?: DateTimeFormatOptions) {
    
    let jsDate: Date;
    if (date instanceof Date) 
        jsDate = date;
    else 
        if (date instanceof Timestamp )
            jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1_000_000);
        else
            jsDate = new Date(date as string)
    


    const options: DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false

    };

    // Format the date in Spanish
    return jsDate.toLocaleDateString('es-ES', extra ? extra : options);
}


function getRemainingTime(targetDate: any) {
    const now: any = new Date(); // Current date and time
    const timeDifference = targetDate - now; // Difference in milliseconds

    if (timeDifference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // If the target date has passed
    }

    // Convert milliseconds to days, hours, minutes, and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

export function updateCountdown(targetDate: Date) {
    const { days, hours, minutes, seconds } = getRemainingTime(targetDate);
    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
}



export function addNDay(targetDate: Date, n: number) {
    targetDate.setDate(targetDate.getDate() + n)
    targetDate.setHours(23)
    targetDate.setMinutes(59)
    return targetDate
}

export function rmNDay(targetDate: Date, n: number) {
    targetDate.setDate(targetDate.getDate() - n)
    targetDate.setHours(23)
    targetDate.setMinutes(59)
    return targetDate
}


export function addNHour(targetDate: Date, n: number) {
    targetDate.setDate(targetDate.getHours() + n)
    return targetDate
}

export function formatLocalDateTime(codeLocale: string, date: Date) {
    return date.toLocaleString(codeLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
