class InvitationModel {
  final String code;
  final String role;
  final String? invitedName;
  final String? invitedEmail;
  final String? phone;
  final String? jobTitle;
  final int usedCount;
  final int maxUses;
  final DateTime? expiresAt;
  final DateTime? createdAt;

  InvitationModel({
    required this.code,
    required this.role,
    this.invitedName,
    this.invitedEmail,
    this.phone,
    this.jobTitle,
    this.usedCount = 0,
    this.maxUses = 1,
    this.expiresAt,
    this.createdAt,
  });

  factory InvitationModel.fromJson(Map<String, dynamic> json) => InvitationModel(
        code: json['code'] as String,
        role: json['role'] as String? ?? 'employee',
        invitedName: json['invitedName'] as String?,
        invitedEmail: json['invitedEmail'] as String?,
        phone: json['phone'] as String?,
        jobTitle: json['jobTitle'] as String?,
        usedCount: json['usedCount'] as int? ?? 0,
        maxUses: json['maxUses'] as int? ?? 1,
        expiresAt: json['expiresAt'] != null ? DateTime.tryParse(json['expiresAt'] as String) : null,
        createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt'] as String) : null,
      );
}
