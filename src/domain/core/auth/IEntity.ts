


/**
 * IUser model interface
 *
 * @export
 * @interface IUser
 * @typedef {IUser}
 */
interface IEntity {

  id?: string;
  name: string;
  slug: string;
  type?: "company" | "autonomous" | "organization" | "event";
  billingEmail?: string;
  language?: 'EN' | 'ES'
  stripeCustomerId?: string;
  branding?: {
    backgroundColor: string
    entityId: string
    icon: string
    iconx2: string
    labelColor: string
    logo: string
    stripImage: string
    textColor: string
    uid: string

  }
  active: boolean;
  createdAt?: Date;
  legal?: {
    legalName: string; // Razón social
    taxId: string; // NIF / CIF / NIE / VAT
    address: {
      street: string;
      city: string;
      postalCode: string;
      region?: string;
      country: string;
    };
  };
  billingConfig: {
    payment_method: Array<{
      brand: "visa" | 'card' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown',
      id: string
      last4: "4242"
    }>
  }
  updatedAt: Date;
}



export default IEntity;
