class ClientModel {
  final String id;
  final String name;
  final String? address;
  final String? phone;
  final String? email;

  ClientModel({
    required this.id,
    required this.name,
    this.address,
    this.phone,
    this.email,
  });

  factory ClientModel.fromJson(Map<String, dynamic> json) => ClientModel(
    id: json['_id'] ?? json['id'] as String,
    name: json['name'] as String,
    address: json['address'] as String?,
    phone: json['phone'] as String?,
    email: json['email'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'name': name,
    'address': address,
    'phone': phone,
    'email': email,
  };
}