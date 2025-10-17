/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/domain/core/auth/IUser";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { getUser } from "@/lib/firebase/authentication/login";
import { fetchUserAccount, signInToken } from "@/services/core/account.service";
import { MAIN_ROUTE, GENERAL_ROUTE, USER_ROUTE, PUBLIC_PATH } from "@/config/routes";
import { useToast } from "@/hooks/useToast";
import IUserEntity from "@/domain/core/auth/IUserEntity";
import { fetchUserEntities } from "@/services/core/entity.service";
import { useAppLocale } from "@/hooks/useAppLocale";
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
    const { currentLocale } = useAppLocale()
    const { showToast } = useToast()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const redirectUri = searchParams.get('redirect')
    const inPublicPage = pathName.startsWith('/auth')
    const { entityId } = useParams<any>()
    const authToken = searchParams.get('authToken')

    /** Refresh User Data */
    const updateUserData = async () => {
        const userAuth: User = await getUser() as User
        const extraData = await fetchUserAccount(userAuth.uid, currentLocale)
        const userData: IUser = {
            ...extraData
        }
        setUser({
            ...userAuth,
            ...userData,
        })
    }





    const watchSesionState = useCallback(async (userAuth: User) => {
        try {
            /*
            const providerData = userAuth?.providerData;
            const isPassword = providerData?.some(
                (profile: any) => profile.providerId === "password"
            );
            */

            if (userAuth) {
                setUserAuth(userAuth)
                setToken(await userAuth.getIdToken())
                const extraData = await fetchUserAccount(userAuth.uid, currentLocale)
                setUser({
                    ...userAuth,
                    ...extraData,
                })
                if (!extraData.email || extraData?.fullName?.trim()?.toLowerCase() === "guest") {
                    //push(`/${MAIN_ROUTE}/${USER_ROUTE}/complete-profile`)
                    setPendAuth(false)
                    return;
                }

                if (redirectUri) push(redirectUri)
                else {
                    await watchPathname(userAuth)
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

    }, [inPublicPage, pathName, push, redirectUri, showToast, updateUserData, entityId])

    const watchPathname = async (userAuth: User) => {
        if (pathName === '/' || pathName === `/${MAIN_ROUTE}` || pathName === `/${MAIN_ROUTE}/${entityId}/${GENERAL_ROUTE}`)
            if (entityId)
                push(`/${MAIN_ROUTE}/${entityId}/dashboard`)
            else {
                const entityList: Array<IUserEntity> = await fetchUserEntities(userAuth.uid)
                if (entityList.length > 0) {
                    const item = entityList[0]
                    push(`/${MAIN_ROUTE}/${item?.entity?.id}/dashboard`)
                } else {
                    push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
                }
            }

        else {
            if (pathName === '/' || pathName === `/${MAIN_ROUTE}` || pathName === `/${MAIN_ROUTE}/user`)
                push(`/${MAIN_ROUTE}/${USER_ROUTE}/account`)
        }
    }

    useEffect(() => {      
        if (!authToken && !PUBLIC_PATH.includes(pathName)) {
            setPendAuth(true)
            const unsubscribe = subscribeToAuthChanges(watchSesionState);
            return () => unsubscribe(); // Cleanup on unmount
        }
    }, [authToken, pathName]);

    const authWithToken = async (authToken: string) => {
        try {
            const data = await signInToken(authToken,currentLocale);
            updateUserData()
            goEntity(data.user.uid)
        } catch (error) {
            push(`/auth/login`)
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }

    }

    const goEntity = async (uid: string) => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(uid as string)
        if (entityList.length > 0) {
            const item = entityList.find(e => e.isActive) ?? entityList[0]
            push(`/${MAIN_ROUTE}/${item?.entity?.id}/dashboard`)
        } else {
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
        }
    }

    /** Auth By Token */

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



//http://localhost:3000/main/kQtfzGZgcWZSLBgR7Oso/entity?authToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc1NzA0MTY1MiwiZXhwIjoxNzU3MDQ1MjUyLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJjb3hlU0c0dUFIZDJmRFZFbEMzM3VRNUxMUDQzIn0.rSRHn_HZtoIjJNWASyDAB2uFP19nW7JYBGz3dOobtCHfOZPjISybRp9GV8LFQaSDU-AsH4MHD4XhMQdod8eDIeCUF3lEzI1GT4u-6Bi5RMno4yZ4J8cKcyvOBCrwQlYjA1vJ7k3hVZFAG9xIexh4kqJtjq5k8kOyU9ZF6KTZkh3FFGsx5U7pnLlQp0rWuWGQZrJlskTby0drDRN_5Sq1PUgrSWqf6JT-Ym25bDZF9bb5OR0Mi7fAWQdycQAYl3L_POSTXA_PWdQ1hS8_1BLTrWBywTHCu74MZk_8UCBCSXvJ8hObuhnr9EG8aAHX_uKz1eY6OoqqAa44f9od0lpfyA&guest=coxeSG4uAHd2fDVElC33uQ5LLP43_kQtfzGZgcWZSLBgR7Oso