import { User } from "firebase/auth";

 
/**
 * IUser model interface
 *
 * @export
 * @interface IUser
 * @typedef {IUser}
 */
interface IUser extends User {
  id?: string;
  slug: string;
  photoURL: any;
  first_name: string;
  last_name: string;
  phoneNumber: string;
  email: string;
  name: string;
  stripeCustomerId: string;
  objetive?:string;
  
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    learndashMigrate:boolean
    learndashId:boolean
  } | any;
  password?: string;
  
}
export default IUser;
