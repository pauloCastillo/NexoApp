import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/datasources/invitation_remote_source.dart';
import 'package:nexo_app/data/repositories/invitation_repository_impl.dart';
import 'package:nexo_app/domain/invitation/entities/invitation_model.dart';
import 'package:nexo_app/domain/invitation/repositories/invitation_repository.dart';

final invitationRepositoryProvider = Provider<InvitationRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return InvitationRepositoryImpl(InvitationRemoteSource(dio));
});

final invitationListProvider = FutureProvider<List<InvitationModel>>((ref) {
  final repo = ref.watch(invitationRepositoryProvider);
  return repo.getAll();
});
