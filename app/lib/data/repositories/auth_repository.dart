import 'package:nexo_app/data/models/user_model.dart';

abstract class AuthRepository {
  Future<UserModel> login(String email, String password);
  Future<UserModel> register(
    String username,
    String email,
    String password, {
    String? companyName,
    String? companyId,
    String? role,
    String? phone,
    String? invitationCode,
  });
  Future<Map<String, dynamic>> validateInvitation(String code);
  Future<Map<String, dynamic>> requestNewCode(String code, {String? email, String? phone});
  Future<UserModel> getProfile();
  Future<void> logout();
  Future<void> changePassword(String currentPassword, String newPassword);
}