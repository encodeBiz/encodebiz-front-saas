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
  fullName: string; 
  phoneNumber: string;
  email: string;
  stripeCustomerId: string;
   
  createdAt: Date;
  updatedAt: Date;
   
  password?: string;
  
}
export default IUser;
