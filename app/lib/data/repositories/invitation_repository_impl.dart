import 'package:nexo_app/data/datasources/invitation_remote_source.dart';
import 'package:nexo_app/domain/invitation/entities/invitation_model.dart';
import 'package:nexo_app/domain/invitation/repositories/invitation_repository.dart';
import 'package:nexo_app/core/network/result.dart';

class InvitationRepositoryImpl implements InvitationRepository {
  final InvitationRemoteSource _src;
  InvitationRepositoryImpl(this._src);
  @override
  Future<Map<String, dynamic>> create(Map<String, dynamic> data) => _src.create(data);
  @override
  Future<List<InvitationModel>> getAll() async {
    final list = await _src.list();
    return list.map((j) => InvitationModel.fromJson(j)).toList();
  }
  @override
  Future<void> revoke(String code) async {
    final r = await _src.revokeResult(code);
    if (r is Err) throw Exception((r as Err).failure.message);
  }
  @override
  Future<Map<String, dynamic>> validate(String code) async {
    final r = await _src.validateResult(code);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
  @override
  Future<Map<String, dynamic>> requestNew(String code, {String? email, String? phone}) async {
    final r = await _src.requestNewResult(code, email: email, phone: phone);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
