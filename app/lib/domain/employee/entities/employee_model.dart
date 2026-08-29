class EmployeeModel {
  final String id;
  final String username;
  final String email;
  final String? phone;
  final String? jobTitle;
  final String role;

  EmployeeModel({
    required this.id,
    required this.username,
    required this.email,
    this.phone,
    this.jobTitle,
    this.role = 'employee',
  });

  factory EmployeeModel.fromJson(Map<String, dynamic> json) => EmployeeModel(
    id: json['_id'] ?? json['id'] as String,
    username: json['username'] as String,
    email: json['email'] as String,
    phone: json['phone'] as String?,
    jobTitle: json['jobTitle'] as String?,
    role: json['role'] as String? ?? 'employee',
  );

  Map<String, dynamic> toJson() => {
    'username': username,
    'email': email,
    'phone': phone,
    'jobTitle': jobTitle,
    'role': role,
  };
}