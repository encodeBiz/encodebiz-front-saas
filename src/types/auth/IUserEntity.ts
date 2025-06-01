import IEntity from "./IEntity";

/**
 * IUserEntity model interface
 *
 * @export
 * @interface IUserEntity
 * @typedef {IUseIUserEntityr}
 */
interface IUserEntity {
  id?: string;
  entityId: string
  role: "owner"
  status: "active"
  isActive: boolean
  userId: string
  createdAt: Date;
  updatedAt: Date;
  entity: IEntity

}
export default IUserEntity;
