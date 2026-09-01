import { Location, Company, Branch, User } from '@/db/models/index.js';
import { TenantContext } from '@/types/models.js';
import { evaluateGeofence } from '@/utils/geofence.js';
import { reverseGeocode } from '@/utils/geocoding.js';

class LocationRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

  // ponytail: removed exact === dedup (GPS jitter never hits) + race — always push atomically

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

        // --- geofence: branch-aware warning (no throw) ---
        const user = await User.findOne({ _id: locationData.employee, company: context.companyId }).select('branches').lean() as any;
        if (!user) throw { statusCode: 404, message: 'Empleado no encontrado en esta empresa' };
        const branchIds: string[] = user?.branches || [];
        const branches: any[] = branchIds.length > 0
          ? await Branch.find({ _id: { $in: branchIds }, company: context.companyId, isActive: true }).lean()
          : await Branch.find({ company: context.companyId, isActive: true }).lean();
        const company = await Company.findById(context.companyId).lean() as any;
        const companyLoc = company?.location?.lat ? { lat: company.location.lat, lng: company.location.lng, geofenceRadius: company.geofenceRadius } : null;
        const evalRes = evaluateGeofence(locationData.latitude, locationData.longitude, branches, companyLoc, company?.name);
        const override = locationData.override === true && ['supervisor', 'business_owner', 'admin', 'superuser', 'platform_admin'].includes(context.role);
        if (override && (!locationData.overrideReason || String(locationData.overrideReason).trim().length < 10)) {
          throw { statusCode: 400, message: 'overrideReason requerido (mín 10 caracteres) para geofence override' };
        }
        locationData.geofenceResult = {
          branchId: evalRes.branchId && evalRes.branchId !== 'company' ? evalRes.branchId : undefined,
          branchName: evalRes.branchName,
          distance: evalRes.distance,
          inside: override ? true : evalRes.inside,
          ...(override ? { overriddenBy: context.userId, overrideReason: String(locationData.overrideReason).trim() } : {}),
        };
        if (override) {
          try {
            const { default: auditLogService } = await import('@/services/auditLogService.js');
            await auditLogService.log({ action: 'geofence.overridden', entityType: 'Location', entityId: locationData.employee, userId: context.userId, companyId: String(context.companyId), metadata: { distance: evalRes.distance, branchName: evalRes.branchName, overrideReason: locationData.overrideReason } });
          } catch {}
        }
        // clean override flags from push
        delete locationData.override;
        delete locationData.overrideReason;

        try {
            locationData.street = await reverseGeocode(locationData.latitude, locationData.longitude);

            return await Location.findOneAndUpdate(
                { employee: locationData.employee, company: context.companyId },
                { $push: { locations: locationData } },
                { new: true, upsert: true }
            );
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
