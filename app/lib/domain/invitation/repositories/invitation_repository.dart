import 'package:nexo_app/domain/invitation/entities/invitation_model.dart';

abstract class InvitationRepository {
  Future<List<InvitationModel>> getAll();
  Future<Map<String, dynamic>> create(Map<String, dynamic> data);
  Future<void> revoke(String code);
  Future<Map<String, dynamic>> validate(String code);
  Future<Map<String, dynamic>> requestNew(String code, {String? email, String? phone});
}
