class CompanyModel {
  final String id;
  final String name;
  final double? locationLat;
  final double? locationLng;
  final int? geofenceRadius;

  CompanyModel({
    required this.id,
    required this.name,
    this.locationLat,
    this.locationLng,
    this.geofenceRadius,
  });

  factory CompanyModel.fromJson(Map<String, dynamic> json) => CompanyModel(
    id: json['_id'] ?? json['id'] as String,
    name: json['name'] as String,
    locationLat: (json['location'] as Map<String, dynamic>?)?['lat']?.toDouble(),
    locationLng: (json['location'] as Map<String, dynamic>?)?['lng']?.toDouble(),
    geofenceRadius: json['geofenceRadius'] as int?,
  );

  Map<String, dynamic> toJson() => {
    '_id': id,
    'name': name,
    if (locationLat != null && locationLng != null)
      'location': {'lat': locationLat, 'lng': locationLng},
    if (geofenceRadius != null) 'geofenceRadius': geofenceRadius,
  };
}
