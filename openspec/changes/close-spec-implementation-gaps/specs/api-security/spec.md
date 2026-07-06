## ADDED Requirements

### Requirement: Rate limiting
The system SHALL apply rate limiting per IP address to prevent abuse.

#### Scenario: Auth endpoint rate limit
- **WHEN** more than 20 requests to `/api/auth/login` are made from the same IP within 1 minute
- **THEN** the system SHALL return 429 Too Many Requests

#### Scenario: General API rate limit
- **WHEN** more than 100 requests to any API endpoint are made from the same IP within 1 minute
- **THEN** the system SHALL return 429 Too Many Requests

#### Scenario: Rate limit bypass in development
- **WHEN** `DEV_STATUS=development`
- **THEN** rate limiting SHALL be disabled

### Requirement: Security HTTP headers
The system SHALL include security headers in all HTTP responses.

#### Scenario: HSTS header present
- **WHEN** any HTTP response is sent
- **THEN** the response SHALL include `Strict-Transport-Security: max-age=31536000; includeSubDomains`

#### Scenario: X-Content-Type-Options header present
- **WHEN** any HTTP response is sent
- **THEN** the response SHALL include `X-Content-Type-Options: nosniff`

#### Scenario: X-Frame-Options header present
- **WHEN** any HTTP response is sent
- **THEN** the response SHALL include `X-Frame-Options: DENY`

### Requirement: Sensitive data redaction in logs
The system SHALL redact sensitive fields from log output.

#### Scenario: Password is redacted in logs
- **WHEN** a request with a `password` field is logged
- **THEN** the logger SHALL replace the password value with `[Redacted]`

#### Scenario: Token is redacted in logs
- **WHEN** a request with a `token` or `authorization` field is logged
- **THEN** the logger SHALL replace those values with `[Redacted]`

#### Scenario: Secret is redacted in logs
- **WHEN** a request with a `secret` field is logged
- **THEN** the logger SHALL replace it with `[Redacted]`
