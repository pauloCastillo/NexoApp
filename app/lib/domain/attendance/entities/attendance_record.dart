class AttendanceRecord {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeEmail;
  final String? entrada;
  final String? descanso;
  final String? retorno;
  final String? salida;
  final DateTime date;

  AttendanceRecord({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeEmail,
    this.entrada,
    this.descanso,
    this.retorno,
    this.salida,
    required this.date,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    final employee = json['employee'] as Map<String, dynamic>?;
    return AttendanceRecord(
      id: json['_id'] as String,
      employeeId: employee?['_id'] as String? ?? '',
      employeeName: employee?['username'] as String? ?? '',
      employeeEmail: employee?['email'] as String? ?? '',
      entrada: json['entrada'] as String?,
      descanso: json['descanso'] as String?,
      retorno: json['retorno'] as String?,
      salida: json['salida'] as String?,
      date: DateTime.parse(json['date'] as String),
    );
  }
}
