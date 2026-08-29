import axios from 'axios';
import { Location, Company } from '@/db/models/index.js';
import { TenantContext } from '@/types/models.js';

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class LocationRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async #verifyingLocation(doc: { employee: string; latitude: number; longitude: number }) {
        const getDoc = await Location.findOne({ employee: doc.employee })
        if (!getDoc) {
            return false;
        }
        const existLocation = getDoc.locations.some((location) =>
            location.latitude === doc.latitude &&
            location.longitude === doc.longitude
        )
        return existLocation;
    }

    async getAllLocations(context: TenantContext) {
        try {
            const allLocations = await Location.find(this.#companyFilter(context));
            return allLocations;
        } catch (error: any) {
            throw new Error("Error fetching locations: " + error.message, { cause: error });
        }
    }

    async getLocationById(employeeData: { employee: string }, context: TenantContext) {
        try {
            const location = await Location.findOne({ employee: employeeData.employee, ...this.#companyFilter(context) });
            if (!location) {
                throw new Error("Location not found");
            }
            return location;
        } catch (error: any) {
            throw new Error("Error fetching location: " + error.message, { cause: error });
        }
    }

    async createLocation(locationData: Record<string, any>, context: TenantContext) {
        locationData.company = context.companyId;

        const company = await Company.findById(context.companyId);
        if (company?.location?.lat && company?.location?.lng && company?.geofenceRadius) {
          const dist = haversineDistance(
            locationData.latitude, locationData.longitude,
            company.location.lat, company.location.lng,
          );
          if (dist > company.geofenceRadius) {
            throw { statusCode: 403, message: `Fuera del área permitida (${Math.round(dist)}m, máximo ${company.geofenceRadius}m)` };
          }
        }

        const existLocation = await this.#verifyingLocation(locationData as any);

        try {
            const apiResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.latitude}&lon=${locationData.longitude}&addressdetails=1`,
                { headers: { 'User-Agent': 'RRHH-App/1.0' } }
            );
            locationData.street = apiResponse.data.display_name || `${locationData.latitude}, ${locationData.longitude}`;

            if (existLocation) {
                return await Location.findOne(
                    { employee: locationData.employee },
                );
            } else {
                return await Location.findOneAndUpdate(
                    { employee: locationData.employee },
                    { $push: { locations: locationData } },
                    { new: true, upsert: true }
                );
            }
        } catch (error: any) {
            throw new Error("Error creating location: " + error.message, { cause: error });
        }
    }

    async deleteLocation(id: string, context: TenantContext) {
        try {
            const deletedLocation = await Location.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
            if (!deletedLocation) {
                throw new Error("Location not found");
            }
            return deletedLocation;
        } catch (error: any) {
            throw new Error("Error deleting location: " + error.message, { cause: error });
        }
    }
}

export default LocationRepository;
