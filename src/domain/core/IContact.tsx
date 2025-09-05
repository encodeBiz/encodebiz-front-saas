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


export interface ContactFromModel {
    name: string
    phone: string
    email: string
    message: string
    subject: string
    token?: string
  }

  /**
   * 
   * const response = await HTTP.post(process.env.NEXT_PUBLIC_ENDPOINT_CONTACT as string,{
            to: 'hola@encodebiz.com', //"receiver@sender.com"
            subject: 'Contacto desde Encodebiz',  //"Message title"
            type: 'CONTACT_ENCODEBIZ', //template typew
            replacements: data
        });
   */