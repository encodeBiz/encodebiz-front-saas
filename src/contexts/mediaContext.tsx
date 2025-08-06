"use client";

import { createContext, useCallback, useEffect, useState } from "react";

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
    const fetchUserMedia = useCallback(async () => {
        const mediaList = await fetchAllMedia(currentEntity?.entity?.id as string)
        setUserMediaList([...mediaList])
    }, [currentEntity?.entity?.id])

    useEffect(() => {
        if (user?.id)
            fetchUserMedia()
    }, [user?.id, currentEntity?.entity?.id, fetchUserMedia]);

    return (
        <MediaContext.Provider value={{ userMediaList, fetchUserMedia }}>
            {children}
        </MediaContext.Provider>
    );
};


