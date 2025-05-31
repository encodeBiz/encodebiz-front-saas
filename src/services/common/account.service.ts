import { login } from "@/lib/firebase/authentication/login";
import httpClientFetchInstance from "@/lib/http/httpClientFetchNext";
import IUser from "@/types/auth/IUser";
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