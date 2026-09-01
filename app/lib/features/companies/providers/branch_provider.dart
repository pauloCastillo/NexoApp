import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/core/services/geocoding_service.dart';
import 'package:nexo_app/data/datasources/branch_remote_source.dart';
import 'package:nexo_app/data/models/branch_model.dart';
import 'package:nexo_app/data/repositories/branch_repository_impl.dart';

final branchRemoteSourceProvider = Provider((ref) => BranchRemoteSource(ref.watch(dioProvider)));
final branchRepositoryProvider = Provider((ref) => BranchRepositoryImpl(ref.watch(branchRemoteSourceProvider)));
final branchesProvider = FutureProvider<List<BranchModel>>((ref) async => ref.watch(branchRepositoryProvider).getBranches());
final geocodingServiceProvider = Provider((ref) => GeocodingService(ref.watch(dioProvider)));
