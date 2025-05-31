import httpClientFetchInstance from "@/lib/http/httpClientFetchNext";
import IUser from "@/types/auth/IUser";


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