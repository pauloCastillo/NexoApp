class WorkOrderModel {
  final String id;
  final String employeeId;
  final String? clientId;
  final String clientName;
  final double? latitude;
  final double? longitude;
  final String description;
  final String date;
  final String status;

  WorkOrderModel({
    required this.id,
    required this.employeeId,
    this.clientId,
    required this.clientName,
    this.latitude,
    this.longitude,
    required this.description,
    required this.date,
    this.status = 'pending',
  });

  factory WorkOrderModel.fromJson(Map<String, dynamic> json) => WorkOrderModel(
    id: json['_id'] ?? json['id'] as String,
    employeeId: json['employee'] is Map ? json['employee']['_id'] as String : json['employee'] as String,
    clientId: json['client'] is Map ? json['client']['_id'] as String? : json['client'] as String?,
    clientName: json['clientName'] as String,
    latitude: (json['location'] as Map?)?['latitude'] as double?,
    longitude: (json['location'] as Map?)?['longitude'] as double?,
    description: json['description'] as String,
    date: json['date'] as String,
    status: json['status'] as String? ?? 'pending',
  );

  Map<String, dynamic> toJson() => {
    'employee': employeeId,
    'client': clientId,
    'clientName': clientName,
    'location': latitude != null && longitude != null ? {'latitude': latitude, 'longitude': longitude} : null,
    'description': description,
    'date': date,
  };
}