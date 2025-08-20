export interface IContact {
    id: string;
    from: string;
    replacements: {
        displayName: string;
    }
    subject: string;
    to: string;
    displayName: string;
    phone: string;
    type: 'WELCOME_EMAIL'
    message: string;

}
