


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
  type: 'company' | 'autonomous' | 'organization' | 'event';
  active: boolean;
  stripeCustomerId?: string;
  billingEmail: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
  createdAt: Date;
  updatedAt: Date;

}
export default IEntity;
