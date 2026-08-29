class UserModel {
  final String id;
  final String email;
  final String name;
  final String role;
  final String companyId;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    required this.companyId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['_id'] ?? json['id'] as String,
    email: json['email'] as String,
    name: json['name'] as String,
    role: json['role'] as String,
    companyId: json['companyId'] as String,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'name': name,
    'role': role,
    'companyId': companyId,
  };
}