import { RegisterFormValues } from "@/app/auth/register/page.controller";
import { collection } from "@/config/collection";
import { changePass, getUser, login, loginWithGoogle, loginWithToken } from "@/lib/firebase/authentication/login";
import { logout } from "@/lib/firebase/authentication/logout";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import httpClientFetchInstance, { codeError, HttpClient } from "@/lib/http/httpClientFetchNext";
import IUser from "@/domain/core/auth/IUser";
import { EmailAuthProvider, reauthenticateWithCredential, updateProfile, User, UserCredential } from "firebase/auth";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
 

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
        return error ? [] : []
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

export async function recoveryPassword(email: string) {
    try {
        const httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URI_RECOVERY_PASS,
            headers: {},
        });
        const response: any = await httpClientFetchInstance.post('', {
            email
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
        }
    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }

}

export async function signUpEmail(data: RegisterFormValues, sessionToken?: string, uid?: string) {
    try {
        const httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URI_CREATE_USER,
            headers: {
                Authorization: `Bearer ${sessionToken}`
            },
        });
        const response: any = await httpClientFetchInstance.post('', {           
            fullName: data.fullName,
            phoneNumber: data.phone,
            uid: uid,
            email: data.email,
            password: data.password,
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
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
        throw new Error(codeError[error.code] ? codeError[error.code] : error?.message)

    }
}



export async function handleLogout(callback: () => void): Promise<void> {
    try {
        await logout()
        if (typeof callback === 'function') callback()
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

export async function updateAccout(photoURL: string, phoneNumber: string, displayName: string): Promise<void> {
    try {
        const user = await getUser()
        await updateProfile(user as User, {
            photoURL,
            displayName
        })

        await updateDocument<Partial<IUser>>({
            collection: collection.USER,
            data: {
                photoURL,
                phoneNumber,
                fullName: displayName,
                updatedAt: new Date(),
            },
            id: user?.uid as string,
        });


    } catch (error: any) {
        throw new Error(codeError[error.code] ? codeError[error.code] : error.message)

    }
}

 