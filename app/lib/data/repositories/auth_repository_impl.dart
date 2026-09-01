import 'package:nexo_app/core/auth/token_service.dart';
import 'package:nexo_app/data/models/user_model.dart';
import 'package:nexo_app/data/datasources/auth_remote_source.dart';
import 'package:nexo_app/data/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteSource _source;
  final _tokenService = TokenService();
  AuthRepositoryImpl(this._source);

  @override
  Future<UserModel> login(String email, String password) async {
    final data = await _source.login(email, password);
    final token = data['token'] as String?;
    final refresh = data['refreshToken'] as String?;
    if (token != null && refresh != null) await _tokenService.saveTokens(token, refresh);
    final user = Map<String, dynamic>.from(data['user'] as Map);
    final company = data['company'] as Map<String, dynamic>?;
    user['companyId'] = data['companyId'] as String? ?? company?['id'] as String? ?? '';
    user['name'] = user['username'] as String? ?? '';
    return UserModel.fromJson(user);
  }

  @override
  Future<UserModel> register(
    String username,
    String email,
    String password, {
    String? companyName,
    String? companyId,
    String? role,
    String? phone,
    String? invitationCode,
  }) async {
    final data = await _source.register(
      username, email, password,
      companyName: companyName,
      companyId: companyId,
      role: role,
      phone: phone,
      invitationCode: invitationCode,
    );
    final token = data['token'] as String?;
    final refresh = data['refreshToken'] as String?;
    if (token != null && refresh != null) await _tokenService.saveTokens(token, refresh);
    final user = Map<String, dynamic>.from(data['user'] as Map);
    final company = data['company'] as Map<String, dynamic>?;
    user['companyId'] = data['companyId'] as String? ?? company?['id'] as String? ?? '';
    user['name'] = user['username'] as String? ?? '';
    return UserModel.fromJson(user);
  }

  @override
  Future<Map<String, dynamic>> validateInvitation(String code) => _source.validateInvitation(code);

  @override
  Future<Map<String, dynamic>> requestNewCode(String code, {String? email, String? phone}) => _source.requestNewCode(code, email: email, phone: phone);

  @override
  Future<UserModel> getProfile() => _source.getProfile();

  @override
  Future<void> logout() async {
    try { await _source.logout(); } catch (_) {}
    await _tokenService.clearTokens();
  }

  @override
  Future<void> changePassword(String currentPassword, String newPassword) =>
      _source.changePassword(currentPassword, newPassword);
}
