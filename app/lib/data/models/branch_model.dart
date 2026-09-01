class BranchModel {
  final String id;
  final String name;
  final String? address;
  final double lat;
  final double lng;
  final int geofenceRadius;
  final String company;
  final bool isActive;

  BranchModel({
    required this.id,
    required this.name,
    this.address,
    required this.lat,
    required this.lng,
    required this.geofenceRadius,
    required this.company,
    this.isActive = true,
  });

  factory BranchModel.fromJson(Map<String, dynamic> j) => BranchModel(
        id: j['_id'] ?? j['id'] as String,
        name: j['name'] as String,
        address: j['address'] as String?,
        lat: (j['location'] as Map<String, dynamic>)['lat'].toDouble(),
        lng: (j['location'] as Map<String, dynamic>)['lng'].toDouble(),
        geofenceRadius: (j['geofenceRadius'] as num).toInt(),
        company: j['company'].toString(),
        isActive: j['isActive'] as bool? ?? true,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        if (address != null) 'address': address,
        'location': {'lat': lat, 'lng': lng},
        'geofenceRadius': geofenceRadius,
      };
}
