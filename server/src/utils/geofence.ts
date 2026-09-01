export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface BranchLike {
  _id: any;
  name: string;
  location: { lat: number; lng: number };
  geofenceRadius: number;
}

export function evaluateGeofence(
  lat: number,
  lng: number,
  branches: BranchLike[],
  companyLocation?: { lat: number; lng: number; geofenceRadius?: number } | null,
  companyName?: string
): { inside: boolean; distance: number; branchId?: string; branchName?: string } {
  const candidates: BranchLike[] = branches.length
    ? branches
    : companyLocation?.lat && companyLocation?.lng
      ? [{ _id: 'company', name: companyName || 'Sede principal', location: { lat: companyLocation.lat, lng: companyLocation.lng }, geofenceRadius: companyLocation.geofenceRadius || 200 }]
      : [];

  // ponytail: closed geofence when no candidates — open would allow spoofed coordinates (see auditoria #1)
  if (candidates.length === 0) return { inside: false, distance: Infinity };

  let best: BranchLike | null = null;
  let minDist = Infinity;
  for (const b of candidates) {
    const d = haversineDistance(lat, lng, b.location.lat, b.location.lng);
    if (d < minDist) {
      minDist = d;
      best = b;
    }
  }
  if (!best) return { inside: false, distance: Infinity };
  const inside = minDist <= best.geofenceRadius;
  return { inside, distance: Math.round(minDist), branchId: String(best._id), branchName: best.name };
}
