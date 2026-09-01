import 'package:nexo_app/data/models/branch_model.dart';

abstract class BranchRepository {
  Future<List<BranchModel>> getBranches();
  Future<BranchModel> createBranch(Map<String, dynamic> body);
  Future<BranchModel> updateBranch(String id, Map<String, dynamic> body);
  Future<void> deleteBranch(String id);
}
