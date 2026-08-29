import 'package:nexo_app/data/models/company_model.dart';

abstract class CompanyRepository {
  Future<List<CompanyModel>> getPublicCompanies();
  Future<CompanyModel> getCompany();
  Future<CompanyModel> updateCompany(Map<String, dynamic> body);
}
