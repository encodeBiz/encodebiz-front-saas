"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth"; 
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/types/auth/IUser";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { getUser } from "@/lib/firebase/authentication/login";
import { redirect } from 'next/navigation';
import { verifyToken } from "@/lib/firebase/authentication/auth_utils";
import { validateToken } from "@/services/common/account.service";

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
    const redirectUri = searchParams.get('redirect')
    const authToken = searchParams.get('authToken')

     

    useEffect(() => {
        setPendAuth(true)
        const unsubscribe = subscribeToAuthChanges(async (userAuth: User) => {
            if (userAuth && !user) {
                updateUserData(userAuth)
                setUserAuth(userAuth)
                console.log(userAuth);               

            } else {
                setUser(null);
                setPendAuth(false)
            }
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const authWithToken = async (authToken: string) =>  {
        const data = await validateToken(authToken);
        console.log(data);
        
       // redirect('/main/')
    }

     useEffect(() => {
       if(authToken)
        authWithToken(authToken)       
    }, [authToken]);

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

