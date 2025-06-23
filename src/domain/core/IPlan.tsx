export interface IPlan {
    id: "freemium" | "bronze" | "enterprise";
    name: string;
    price: string;
    period: string;
    features: string[];
    featured?: boolean;
}