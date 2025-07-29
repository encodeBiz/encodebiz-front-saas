"use client";

import { createContext, useEffect, useState } from "react";

import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { User } from "firebase/auth";
import { useRouter } from "nextjs-toploader/app";
import IUser from "@/domain/auth/IUser";
import { fetchUserAccount } from "@/services/common/account.service";
import { IUserMedia } from "@/domain/core/IUserMedia";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllMedia } from "@/services/common/media.service";
import { useEntity } from "@/hooks/useEntity";

interface MediaContextType {
    userMediaList: Array<IUserMedia> | [];
    fetchUserMedia: () => void;

}
export const MediaContext = createContext<MediaContextType | undefined>(undefined);
export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
    const [userMediaList, setUserMediaList] = useState<Array<IUserMedia>>([]);
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const fetchUserMedia = async () => {
        const mediaList = await fetchAllMedia(currentEntity?.entity?.id as string)
        setUserMediaList([...mediaList])
    }

    useEffect(() => {
        if (user?.id)
            fetchUserMedia()
    }, [user?.id, currentEntity?.entity?.id]);

    return (
        <MediaContext.Provider value={{ userMediaList, fetchUserMedia }}>
            {children}
        </MediaContext.Provider>
    );
};


