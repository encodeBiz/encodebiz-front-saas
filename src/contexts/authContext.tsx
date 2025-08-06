'use client';
import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/domain/auth/IUser";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { getUser } from "@/lib/firebase/authentication/login";
import { fetchUserAccount, signInToken } from "@/services/common/account.service";
import { MAIN_ROUTE, GENERAL_ROUTE, USER_ROUTE } from "@/config/routes";
import { useToast } from "@/hooks/useToast";
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
    const { showToast } = useToast()

    const searchParams = useSearchParams()
    const pathName = usePathname()
    const redirectUri = searchParams.get('redirect')
    const inPublicPage = pathName.startsWith('/auth')


    /** Refresh User Data */
    const updateUserData = useCallback(async () => {
        const userAuth: User = await getUser() as User
        const extraData = await fetchUserAccount(userAuth.uid)
        const userData: IUser = {
            ...extraData,
            completeProfile: extraData.email ? true : false
        }
        setUser({
            ...userAuth,
            ...userData,
        })

        setTimeout(() => {
            if (redirectUri) push(redirectUri)
            setPendAuth(false)
        }, 1000)


    }, [push, redirectUri])

    const watchSesionState = useCallback(async (userAuth: User) => {
        try {

            if (userAuth) {
                updateUserData()
                setToken(await userAuth.getIdToken())

                const extraData = await fetchUserAccount(userAuth.uid)

                const userData: IUser = {
                    ...extraData,
                    completeProfile: extraData.email ? true : false
                }
                setUser({
                    ...userAuth,
                    ...userData,
                })

                if (!userData.completeProfile) {
                    push(`/${MAIN_ROUTE}/${USER_ROUTE}/complete-profile`)
                }
                setUserAuth(userAuth)
                if (redirectUri) push(redirectUri)
                else {
                    if (pathName === '/' || pathName === '/main' || pathName === '/main/core')
                        push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/dashboard`)
                    else {
                        if (pathName === '/' || pathName === '/main' || pathName === '/main/user')
                            push(`/${MAIN_ROUTE}/${USER_ROUTE}/account`)
                    }
                }
                setPendAuth(false)
            } else {
                setUser(null);
                setPendAuth(false)
                if (!inPublicPage)
                    push('/auth/login')
            }
        } catch (error) {
            if (error instanceof Error)
                showToast(error.message, 'error');
            else
                showToast(String(error), 'error');
        }

    }, [inPublicPage, pathName, push, redirectUri, showToast, updateUserData])


    useEffect(() => {
        setPendAuth(true)
        const unsubscribe = subscribeToAuthChanges(watchSesionState);
        return () => unsubscribe(); // Cleanup on unmount
    }, [watchSesionState]);

    const authWithToken = async (authToken: string) => {
        await signInToken(authToken);
    }

    /** Auth By Token */
    const authToken = searchParams.get('authToken')
    useEffect(() => {
        if (authToken)
            authWithToken(authToken)
    }, [authToken]);







    return (
        <AuthContext.Provider value={{ user, setUser, userAuth, pendAuth, token, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

