# Security Policy

## Security Measures Implemented

### 1. Input Validation
- All form inputs validated on client-side before submission
- Length limits enforced (3-100 chars for names, max 500 for descriptions)
- Date validation ensures future dates only
- Pattern matching prevents common injection attempts

### 2. XSS Prevention
- All user-generated content escaped before rendering
- HTML special characters converted to entities
- Dangerous patterns blocked (`<script>`, `javascript:`, event handlers)
- No use of `eval()` or `innerHTML` with unsanitized data

### 3. Data Storage Security
- localStorage used for non-sensitive data only
- No passwords or sensitive info stored client-side
- Data validated before storage
- Automatic cache invalidation (24-hour TTL)

### 4. API Security
- HTTPS enforced in production
- Error messages don't expose system details
- Rate limiting considerations documented
- CORS properly configured

### 5. Dependencies
- Regular `npm audit` checks in CI pipeline
- No known vulnerabilities in dependencies
- Minimal dependency footprint

