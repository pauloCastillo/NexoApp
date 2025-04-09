require("dotenv").config();
const axios = require("axios");
const { Location } = require("../db/models");

class LocationRepository {
    async getAllLocations() {
        try {
            const allLocations = await Location.find();
            return allLocations;
        } catch (error) {
            throw new Error("Error fetching locations: " + error.message);
        }
    }

    async getLocationById(id) {
        try {
            const location = await Location.findOne().where({ employee: id });
            if (!location) {
                throw new Error("Location not found");
            }
            return location;
        } catch (error) {
            throw new Error("Error fetching location: " + error.message);
        }
    }
   
    async createLocation(locationData) {
        const apiResponse = await axios.get(
            `https://discover.search.hereapi.com/v1/discover?at=${locationData.latitude},${locationData.longitude}&q=${locationData.latitude},${locationData.longitude}&in=countryCode%3ABOL&apiKey=${process.env.API_KEY}`
          );
        const streetName = apiResponse.data.items[0].title;
        locationData.street = streetName;

        try {
            return await Location.create(locationData);
        } catch (error) {
            throw new Error("Error creating location: " + error.message);
        }
    }

    async updateLocation(id, locationData) {
        try {
            const updatedLocation = await Location.findByIdAndUpdate(id, locationData, { new: true });
            if (!updatedLocation) {
                throw new Error("Location not found");
            }
            return updatedLocation;
        } catch (error) {
            throw new Error("Error updating location: " + error.message);
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