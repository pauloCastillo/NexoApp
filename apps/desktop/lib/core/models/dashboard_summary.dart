class DashboardSummaryModel {
  final int activeEmployees;
  final int todayAttendances;
  final int pendingPermissions;
  final int activeWorkOrders;

  DashboardSummaryModel({
    required this.activeEmployees,
    required this.todayAttendances,
    required this.pendingPermissions,
    required this.activeWorkOrders,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) => DashboardSummaryModel(
    activeEmployees: json['activeEmployees'] as int? ?? 0,
    todayAttendances: json['todayAttendances'] as int? ?? 0,
    pendingPermissions: json['pendingPermissions'] as int? ?? 0,
    activeWorkOrders: json['activeWorkOrders'] as int? ?? 0,
  );
}