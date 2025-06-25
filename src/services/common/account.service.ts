import { RegisterFormValues } from "@/app/auth/register/page.controller";
import { collection } from "@/config/collection";
import { createUser } from "@/lib/firebase/authentication/create";
import { changePass, getUser, login, loginWithGoogle, loginWithToken } from "@/lib/firebase/authentication/login";
import { logout } from "@/lib/firebase/authentication/logout";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import httpClientFetchInstance, { codeError, HttpClient } from "@/lib/http/httpClientFetchNext";
import IUser from "@/domain/auth/IUser";
import { EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential, updateProfile, User, UserCredential } from "firebase/auth";


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
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}


export async function signInGoogle(): Promise<UserCredential> {
    try {
        return await loginWithGoogle()
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}

export async function signInEmail(
    email: string, password: string
): Promise<UserCredential> {
    try {
        return await login({ email, password })
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

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
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }

}




export async function fetchUserAccount(
    uid: string
): Promise<IUser> {
    try {
        return await getOne(collection.USER, uid);
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}



export async function handleLogout(): Promise<void> {
    try {
        await logout()
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}

export async function reAuth(password: string): Promise<UserCredential> {
    try {
        const user = await getUser()
        const credencial = EmailAuthProvider.credential(user?.email as string, password)
        return await reauthenticateWithCredential(user as User, credencial)
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)
    }
}


export async function changePassword(password: string): Promise<void> {
    try {
        const user = await getUser()
        await changePass(user as User, password)
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}

export async function updateAccout(photoURL: string, displayName: string): Promise<void> {
    try {
        const user = await getUser()
        return await updateProfile(user as User, {
            photoURL,
            displayName
        })
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}