import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/data/models/company_model.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/datasources/company_remote_source.dart';
import 'package:nexo_app/data/repositories/company_repository_impl.dart';
import 'package:nexo_app/data/repositories/company_repository.dart';

final companyRepositoryProvider = Provider<CompanyRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return CompanyRepositoryImpl(CompanyRemoteSource(dio));
});

final publicCompaniesProvider = FutureProvider<List<CompanyModel>>((ref) {
  return ref.watch(companyRepositoryProvider).getPublicCompanies();
});

final companyProvider = FutureProvider<CompanyModel>((ref) {
  return ref.watch(companyRepositoryProvider).getCompany();
});
