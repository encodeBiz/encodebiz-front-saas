export interface IService {

    id: 'passinbiz' | 'checkinbiz'; // o string si lo generalizas
    name: string;
    description: string;
    availablePlans: Array<'freemium' | 'bronze' | 'gold' | 'enterprise'>;
}

