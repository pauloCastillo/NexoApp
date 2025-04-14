require("dotenv").config();
const axios = require("axios");
const { Location } = require("../db/models");

class LocationRepository {
    async #verifyingLocation(doc){
        const getDoc = await Location.findOne({ employee: doc.employee })
        if(!getDoc){
            return false;
        }
        const existLocation = getDoc.locations.some((location) => 
            location.latitude === doc.latitude && 
            location.longitude === doc.longitude
        )
        return existLocation;
    }

    async getAllLocations() {
        try {
            const allLocations = await Location.find();
            return allLocations;
        } catch (error) {
            throw new Error("Error fetching locations: " + error.message);
        }
    }

    async getLocationById(employeeData) {
        try {
            const location = await Location.findOne().where({ employee: employeeData.employee});
            if (!location) {
                throw new Error("Location not found");
            }
            return location;
        } catch (error) {
            throw new Error("Error fetching location: " + error.message);
        }
    }
   
    async createLocation(locationData) {

        const existLocation = await this.#verifyingLocation(locationData);
        const apiResponse = await axios.get(
            `https://discover.search.hereapi.com/v1/discover?at=${locationData.latitude},${locationData.longitude}&q=${locationData.latitude},${locationData.longitude}&in=countryCode%3ABOL&apiKey=${process.env.API_KEY}`
          );
        const streetName = apiResponse.data.items[0].title;
        locationData.street = streetName;    
    
        try {
                
            if(existLocation){
                return await Location.findOne(
                    { employee: locationData.employee }, 
                );
            }else{
                return await Location.findOneAndUpdate(
                    { employee: locationData.employee }, 
                    { $push: { locations: locationData}}, 
                    { new: true, upsert: true }
                );
            }
            
        } catch (error) {
            throw new Error("Error creating location: " + error.message);
        }
    }

    async deleteLocation(id) {
        try {
            const deletedLocation = await Location.findByIdAndDelete(id);
            if (!deletedLocation) {
                throw new Error("Location not found");
            }
            return deletedLocation;
        } catch (error) {
            throw new Error("Error deleting location: " + error.message);
        }
    }
}

module.exports = LocationRepository;