sealed class Result<T> {
  const Result();
}

class Ok<T> extends Result<T> {
  final T value;
  const Ok(this.value);
}

class Err<T> extends Result<T> {
  final Failure failure;
  const Err(this.failure);
}

class Failure {
  final String message;
  final String code;
  final int? statusCode;
  final String? requestId;
  final List<Map<String, String>>? errors;
  const Failure({
    required this.message,
    required this.code,
    this.statusCode,
    this.requestId,
    this.errors,
  });

  @override
  String toString() => 'Failure($code: $message)';
}
