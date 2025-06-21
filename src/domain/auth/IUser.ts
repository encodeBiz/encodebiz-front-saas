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
  email: string;
  fullName: string;
  phoneNumber: string; 
  lastLoginAt?: string;
  active: boolean;   
  createdAt: Date;
  updatedAt: Date;   
  password?: string;
  
}
export default IUser;
