import 'package:nexo_desktop/core/models/user.dart';
import 'package:nexo_desktop/desktop/features/auth/data/datasources/auth_remote_source.dart';
import 'package:nexo_desktop/desktop/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteSource _source;
  AuthRepositoryImpl(this._source);

  @override
  Future<UserModel> login(String email, String password) async {
    final data = await _source.login(email, password);
    return UserModel.fromJson(data);
  }

  @override
  Future<UserModel> getProfile() => _source.getProfile();

  @override
  Future<void> logout() => _source.logout();
}