import 'package:nexo_desktop/core/models/user.dart';

abstract class AuthRepository {
  Future<UserModel> login(String email, String password);
  Future<UserModel> getProfile();
  Future<void> logout();
}