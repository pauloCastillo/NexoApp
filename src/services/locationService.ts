import type { TenantContext } from '@/types/models.js';
import LocationRepository from '@/repositories/locationRepository.js';

class LocationService{
    private _location: Record<string, any>;
    private _repository: LocationRepository;
    private _context?: TenantContext;

    constructor(location: Record<string, any>, repository: LocationRepository, context?: TenantContext){
        this._location = location;
        this._repository = repository;
        this._context = context;
    }
    
    async create(){
        try {
            return await this._repository.createLocation(this._location, this._context!);
        } catch (error: any) {
            throw new Error("Error creating location: " + error.message);
        }
    }

    async getLocation(){
        try {
            const location = await this._repository.getLocationById(this._location as { employee: string }, this._context!);
            return location;
        } catch (error: any) {
            throw new Error("Error getting location: " + error.message);
        }
    }


}

export default LocationService;