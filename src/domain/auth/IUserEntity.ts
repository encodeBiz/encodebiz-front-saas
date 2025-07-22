import IEntity from "./IEntity";
import IUser from "./IUser";

/**
 * IUserEntity model interface
 *
 * @export
 * @interface IUserEntity
 * @typedef {IUseIUserEntityr}
 */
interface IUserEntity {
  id?: string;
  userId: string;
  entityId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  joinedAt: string;
  createdAt: Date;
  updatedAt: Date;
  entity: IEntity
  user:IUser
  isActive: boolean

}
export default IUserEntity;
