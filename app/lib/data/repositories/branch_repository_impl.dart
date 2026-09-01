import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/data/datasources/branch_remote_source.dart';
import 'package:nexo_app/data/models/branch_model.dart';
import 'package:nexo_app/data/repositories/branch_repository.dart';

class BranchRepositoryImpl implements BranchRepository {
  final BranchRemoteSource _src;
  BranchRepositoryImpl(this._src);

  @override
  Future<List<BranchModel>> getBranches() async {
    final data = await _src.getBranches();
    return data.map((j) => BranchModel.fromJson(j)).toList();
  }

  @override
  Future<BranchModel> createBranch(Map<String, dynamic> body) async {
    final j = await _src.createBranch(body);
    return BranchModel.fromJson(j);
  }

  @override
  Future<BranchModel> updateBranch(String id, Map<String, dynamic> body) async {
    final j = await _src.updateBranch(id, body);
    return BranchModel.fromJson(j);
  }

  @override
  Future<void> deleteBranch(String id) async {
    final r = await _src.deleteBranchResult(id);
    if (r is Err) throw Exception((r as Err).failure.message);
  }
}
