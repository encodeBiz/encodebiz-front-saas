  


/**
 * IUser model interface
 *
 * @export
 * @interface IUser
 * @typedef {IUser}
 */
interface IEntity{
  id?: string;
 
  name: string;
 
  createdAt: Date;
  updatedAt: Date;
 
}
export default IEntity;
