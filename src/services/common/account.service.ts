import { RegisterFormValues } from "@/app/auth/register/page.controller";
import { collection } from "@/config/collection";
import { createUser } from "@/lib/firebase/authentication/create";
import { login, loginWithGoogle, loginWithToken } from "@/lib/firebase/authentication/login";
import { logout } from "@/lib/firebase/authentication/logout";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { searchFirestore, searchFirestoreCount } from "@/lib/firebase/firestore/searchFirestore";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import httpClientFetchInstance, { HttpClient } from "@/lib/http/httpClientFetchNext";
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

export async function signInToken(
    token: string
): Promise<UserCredential> {
    try {
        return await loginWithToken(token)
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export async function signInGoogle(): Promise<UserCredential> {
    try {
        return await loginWithGoogle()
    } catch (error: any) {
        throw new Error(error.message)
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



export async function signUpEmail(data: RegisterFormValues) {
    try {
        const responseAuth = await createUser(data.email, data.password);
        const token = await responseAuth.user.getIdToken();
        if (!responseAuth) {
            throw new Error('Error to fetch user auth token')
        } else {
            let httpClientFetchInstance: HttpClient = new HttpClient({
                baseURL: process.env.NEXT_PUBLIC_BACKEND_URI_CREATE_USER,
                headers: {
                    token: `Bearer ${token}`
                },
            });
            const response: any = await httpClientFetchInstance.post('', {
                entityLegalName: data.legalEntityName,
                fullName: data.fullName,
                phoneNumber: data.phone,
                uid: responseAuth.user.uid,
                email: data.email,
                password: data.password,
            });
            if (response.errCode && response.errCode !== 200) {
                throw new Error(response.message)
            }


        }
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



export async function handleLogout(): Promise<void> {
    try {
        await logout()
    } catch (error: any) {
        throw new Error(error.message)
    }
}
