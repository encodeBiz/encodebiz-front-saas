import { collection } from "@/config/collection";
import { login } from "@/lib/firebase/authentication/login";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { searchFirestore, searchFirestoreCount } from "@/lib/firebase/firestore/searchFirestore";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import httpClientFetchInstance from "@/lib/http/httpClientFetchNext";
import IEntity from "@/types/auth/IEntity";
import IUser from "@/types/auth/IUser";
import IUserEntity from "@/types/auth/IUserEntity";
import { SearchParams } from "@/types/firebase/firestore";
import { UserCredential } from "firebase/auth";


export async function validateToken(
    token: string,
): Promise<Array<IUser>> {
    try {
        const items = await httpClientFetchInstance.post<Array<IUser>>(
            `/api/auth/verify-token`,
            { token }
        );
        return items;
    } catch (error) {
        console.error("Error fetching items:", error);
        return []
    }
}


export async function signInEmail(
    email: string, password: string
): Promise<UserCredential> {
    try {
        return await login({ email, password })
    } catch (error: any) {
        throw new Error(error.message)
    }
}




export async function fetchUserAccount(
    uid: string
): Promise<IUser> {
    try {
        return await getOne(collection.USER, uid);
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function fetchEntity(
    id: string
): Promise<IEntity> {
    try {
        return await getOne(collection.ENTITIES, id);
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export async function fetchUserEntities(
    uid: string
): Promise<Array<IUserEntity>> {
    const params: SearchParams = {
        collection: collection.USER_ENTITY_ROLES,
        filters: [{
            field: 'userId',
            operator: '==',
            value: uid,
        }]
    }
    try {
        const resultList: IUserEntity[] = await searchFirestore(params);
        return await Promise.all(resultList.map(async (item) => {
            const entity = await fetchEntity(item.entityId);
            return {
                ...item,
                entity
            }
        }))

    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function saveStateCurrentEntity(
    entityList: Array<IUserEntity>
): Promise<void> {
    try {
        console.log(entityList);
        
        entityList.forEach(async element => {
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
        throw new Error(error.message)
    }
}


