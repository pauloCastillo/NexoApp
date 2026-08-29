import 'package:nexo_app/data/models/company_model.dart';
import 'package:nexo_app/data/datasources/company_remote_source.dart';
import 'package:nexo_app/data/repositories/company_repository.dart';

class CompanyRepositoryImpl implements CompanyRepository {
  final CompanyRemoteSource _source;
  CompanyRepositoryImpl(this._source);

  @override
  Future<List<CompanyModel>> getPublicCompanies() async {
    final data = await _source.getPublicCompanies();
    return data.map((json) => CompanyModel.fromJson(json)).toList();
  }

  @override
  Future<CompanyModel> getCompany() async {
    final data = await _source.getCompany();
    return CompanyModel.fromJson(data);
  }

  @override
  Future<CompanyModel> updateCompany(Map<String, dynamic> body) async {
    final data = await _source.updateCompany(body);
    return CompanyModel.fromJson(data);
  }
}
