## ADDED Requirements

### Requirement: Refresh token storage
The system SHALL store a hash of each active refresh token in the user's document.

#### Scenario: Login stores refresh token hash
- **WHEN** a user logs in successfully
- **THEN** the system SHALL generate a refresh token, store its bcrypt hash in the user's `refreshTokenHash` field, and return the token to the client

### Requirement: Refresh token rotation
Each refresh operation SHALL invalidate the previous refresh token.

#### Scenario: Successful refresh invalidates old token
- **WHEN** a valid refresh token is presented at `POST /api/auth/refresh`
- **THEN** the system SHALL:
  1. Verify the token's bcrypt hash matches the stored hash
  2. Generate a new access token and refresh token
  3. Update the stored hash to the new refresh token's hash
  4. Return the new token pair

### Requirement: Refresh token reuse detection
The system SHALL detect and reject reuse of old (already rotated) refresh tokens.

#### Scenario: Reused refresh token is rejected
- **WHEN** an old refresh token (already rotated) is presented at `/api/auth/refresh`
- **THEN** the system SHALL:
  1. Detect that the hash does not match
  2. Reject with 401 Unauthorized
  3. Clear the stored hash (force re-login) as a security measure

### Requirement: Refresh token expiry
The system SHALL enforce a 7-day expiry on refresh tokens.

#### Scenario: Expired refresh token is rejected
- **WHEN** a refresh token older than 7 days is presented
- **THEN** the system SHALL return 401 Unauthorized with message "Refresh token expirado"
