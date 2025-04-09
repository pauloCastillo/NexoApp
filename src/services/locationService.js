class LocationService{
    constructor(location, repository){
        this._location = location;
        this._repository = repository;
    }

    async create(){
        //TODO check if location already exists for this employee
        try {
            const doc = await this._repository.getLocationById(this._location.employee);
            if (doc) {
                throw new Error("Location already exists for this employee.");
            }
            return await this._repository.createLocation(this._location);
        } catch (error) {
            throw new Error("Error creating location: " + error.message);
        }
    }

    async getLocation(){
        try {
            const location = await this._repository.getLocation();
            return location;
        } catch (error) {
            throw new Error("Error getting location: " + error.message);
        }
    }

    async updateLocation(){
        try {
            const location = await this._repository.updateLocation(this._location);
            return location;
        } catch (error) {
            throw new Error("Error updating location: " + error.message);
        }
    }
}

module.exports = LocationService;