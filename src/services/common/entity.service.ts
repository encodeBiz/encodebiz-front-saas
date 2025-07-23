
import IEntity from "@/domain/auth/IEntity";
import IUserEntity from "@/domain/auth/IUserEntity";
import { SearchParams } from "@/domain/firebase/firestore";
import { getOne, getAll, getAllWithLimit } from "@/lib/firebase/firestore/readDocument";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { EntityFormValues } from "@/app/main/core/entity/create/page.controller";
import { EntityUpdatedFormValues, BrandFormValues } from "@/app/main/core/entity/tabs/tabEntity/page.controller";
import { IAssing } from "@/app/main/core/entity/tabs/tabCollaborators/page.controller";
import { fetchUser, fetchUsers } from "./users.service";
import { deleteDocument } from "@/lib/firebase/firestore/deleteDocument";

export async function fetchEntity(id: string): Promise<IEntity> {
  try {
    return await getOne(collection.ENTITIES, id);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchUserEntities(
  uid: string
): Promise<Array<IUserEntity>> {
  const params: SearchParams = {
    collection: collection.USER_ENTITY_ROLES,
    filters: [
      {
        field: "userId",
        operator: "==",
        value: uid,
      },
    ],
  };
  try {
    const resultList: IUserEntity[] = await searchFirestore(params);
    return await Promise.all(
      resultList.map(async (item) => {
        const entity = await fetchEntity(item.entityId);
        return {
          ...item,
          entity,
        };
      })
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function saveStateCurrentEntity(
  entityList: Array<IUserEntity>
): Promise<void> {
  try {
    entityList.forEach(async (element) => {
      await updateDocument<IUserEntity>({
        collection: collection.USER_ENTITY_ROLES,
        data: {
          isActive: element.isActive,
          updatedAt: new Date(),
        },
        id: element.id as string,
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}



export async function createEntity(data: EntityFormValues, token: string) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_CREATE_ENTITY as string,
        {
          ...data,

        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateEntity(
  data: EntityUpdatedFormValues | any,
  token: string
) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_UPDATE_ENTITY as string,
        {
          ...data,
        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateEntityBranding(
  data: BrandFormValues | any,
  token: string
) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_UPDATE_BRANDNG_ENTITY as string,
        data
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Servicio para obtener todas las entidades
 */
export async function fetchAllEntities(): Promise<IEntity[]> {
  try {
    const entities = await getAll<IEntity>(collection.ENTITIES);
    return entities;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Servicio para obtener entidades con límite y paginación
 */
export async function fetchAllEntitiesPaginated(limitCount: number = 5, startAfter: any = undefined) {
  try {
    const { data, lastVisible } = await getAllWithLimit<IEntity>(collection.ENTITIES, limitCount, startAfter);
    return { items: data, lastVisible };
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function deleteEntity(data: {
  "entityId": string,
  "uid": string
} | any, token: string) {
  try {

    if (!token) {
      throw new Error('Error to fetch user auth token')
    } else {
      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: '',
        headers: {
          token: `Bearer ${token}`
        },
      });
      const response: any = await httpClientFetchInstance.delete(process.env.NEXT_PUBLIC_BACKEND_URI_DELETE_ENTITY as string, {
        ...data
      });
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message)
      }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}


export async function assignedUserToEntity(data: IAssing, token: string) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_ASSING_USER as string,
        {
          ...data,

        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}


/**
 * Servicio para obtener todas las entidades
 */
export async function fetchAllOwnerOfEntity(entityId: string): Promise<IUserEntity[]> {

  const params: SearchParams = {
    collection: collection.USER_ENTITY_ROLES,
    filters: [
      {
        field: "entityId",
        operator: "==",
        value: entityId,
      },
    ],
  };
  try {
    const resultList: IUserEntity[] = await searchFirestore(params);
    return await Promise.all(
      resultList.map(async (item) => {
        const entity = await fetchEntity(item.entityId);
        const user = await fetchUser(item.userId);
        return {
          ...item,
          entity,
          user
        };
      })
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function deleteOwnerOfEntity(id: string): Promise<void> {
  try {
    await deleteDocument({
      collection: `${collection.USER_ENTITY_ROLES}`,
      id
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}