import { haversineDistance, evaluateGeofence } from '@/utils/geofence.js';

describe('haversineDistance', () => {
  it('~11m for 0.0001 deg lat', () => {
    const d = haversineDistance(19.4326, -99.1332, 19.4327, -99.1332);
    expect(d).toBeGreaterThan(10);
    expect(d).toBeLessThan(15);
  });
  it('0 for same point', () => {
    expect(haversineDistance(0,0,0,0)).toBe(0);
  });
});

describe('evaluateGeofence', () => {
  it('inside when within radius', () => {
    const r = evaluateGeofence(19.4326, -99.1332, [{_id:'b1', name:'A', location:{lat:19.4326,lng:-99.1332}, geofenceRadius:200}], null);
    expect(r.inside).toBe(true);
    expect(r.distance).toBe(0);
    expect(r.branchId).toBe('b1');
  });
  it('outside when far', () => {
    const r = evaluateGeofence(19.5, -99.5, [{_id:'b1', name:'A', location:{lat:19.4326,lng:-99.1332}, geofenceRadius:200}], null);
    expect(r.inside).toBe(false);
    expect(r.distance).toBeGreaterThan(200);
  });
  it('fallback to company when no branches', () => {
    const r = evaluateGeofence(19.4326, -99.1332, [], {lat:19.4326,lng:-99.1332, geofenceRadius:100}, 'Sede');
    expect(r.inside).toBe(true);
    expect(r.branchName).toBe('Sede');
  });
  it('no candidates → inside true', () => {
    const r = evaluateGeofence(0,0, [], null);
    expect(r.inside).toBe(true);
  });
  it('picks closest branch', () => {
    const r = evaluateGeofence(19.4326, -99.1332, [
      {_id:'far', name:'Far', location:{lat:19.5,lng:-99.5}, geofenceRadius:200},
      {_id:'near', name:'Near', location:{lat:19.4326,lng:-99.1332}, geofenceRadius:50},
    ], null);
    expect(r.branchId).toBe('near');
    expect(r.inside).toBe(true);
  });
});
