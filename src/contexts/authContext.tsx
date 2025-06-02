"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/types/auth/IUser";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { getUser } from "@/lib/firebase/authentication/login";
import { fetchUserAccount, fetchUserEntities, validateToken } from "@/services/common/account.service";
import { useEntity } from "@/hooks/useEntity";
import IEntity from "@/types/auth/IEntity";
interface AuthContextType {
    user: IUser | null;
    userAuth: User | null;
    setUser: (user: IUser | null) => void;
    pendAuth: boolean
    token: string
    updateUserData: (loggedUser?: User) => void
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | any>(null);
    const [userAuth, setUserAuth] = useState<User | null>(null);
    const [token, setToken] = useState<string>('');
    const [pendAuth, setPendAuth] = useState(true);
    const { push } = useRouter()

    const searchParams = useSearchParams()
    const pathName = usePathname()
    const redirectUri = searchParams.get('redirect')
    const inPublicPage = pathName.startsWith('/auth')

    const watchSesionState = async (userAuth: User) => {
        if (userAuth) {
            updateUserData(userAuth)
            setToken(await userAuth.getIdToken())
            setUser({
                ...await fetchUserAccount(userAuth.uid),
                ...userAuth
            })
            setUserAuth(userAuth)
            if (redirectUri) push(redirectUri)
            else push('/main/dashboard')
        } else {
            setUser(null);
            setPendAuth(false)
            if (!inPublicPage)
                push('/auth/login')
        }
    }


    useEffect(() => {
        setPendAuth(true)
        const unsubscribe = subscribeToAuthChanges(watchSesionState);
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const authWithToken = async (authToken: string) => {
        const data = await validateToken(authToken);
    }

    /** Auth By Token */
    const authToken = searchParams.get('authToken')
    useEffect(() => {
        if (authToken)
            authWithToken(authToken)
    }, [authToken]);


    /** Refresh User Data */
    const updateUserData = async (loggedUser?: User) => {
        let userAuth: User = loggedUser as User
        if (!user)
            userAuth = await getUser() as User

        setTimeout(() => {
            if (redirectUri) push(redirectUri)
            setPendAuth(false)
        }, 1000)


    }




    return (
        <AuthContext.Provider value={{ user, setUser, userAuth, pendAuth, token, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

