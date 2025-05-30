"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth"; 
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/types/auth/IUser";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { getUser } from "@/lib/firebase/authentication/login";

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
    const [user, setUser] = useState<IUser | null>(null);
    const [userAuth, setUserAuth] = useState<User | null>(null);

    const [token, setToken] = useState<string>('');
    const [pendAuth, setPendAuth] = useState(true);
    const { push } = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    useEffect(() => {
        setPendAuth(true)
        const unsubscribe = subscribeToAuthChanges(async (userAuth: User) => {
            if (userAuth && !user) {
                updateUserData(userAuth)
                setUserAuth(userAuth)

            } else {
                setUser(null);
                setPendAuth(false)
            }
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const updateUserData = async (loggedUser?: User) => {
        let userAuth: User = loggedUser as User
        if (!user)
            userAuth = await getUser() as User
    
        setTimeout(() => {                      
            if (redirect) push(redirect)
            setPendAuth(false)
        }, 1000)
 

    }




    return (
        <AuthContext.Provider value={{ user, setUser, userAuth, pendAuth, token, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

