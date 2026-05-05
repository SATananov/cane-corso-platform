# JWT / Session Secret Contract

**Document Version**: 1.0  
**Date**: May 3, 2026  
**Status**: Pre-Neon (Neon is not the auth provider)

This document defines the contract and rules for JWT and session management in the Cane Corso Platform.

---

## Executive Summary

- **Auth Provider**: Application-owned (not Neon, not external IdP)
- **Session Mechanism**: JWT tokens signed with AUTH_SECRET
- **Storage**: HttpOnly, Secure cookies (not localStorage)
- **Neon Role**: Database stores user profiles and roles only; Neon is never the auth source
- **Secret Management**: AUTH_SECRET is **never committed**, loaded from environment only

---

## Session Architecture

### Overview

The application uses **JWT (JSON Web Tokens)** for stateless authentication:

1. User logs in → Server validates credentials against database
2. Server signs JWT with AUTH_SECRET
3. JWT stored in HttpOnly cookie
4. Subsequent requests include cookie with JWT
5. Server validates JWT signature using AUTH_SECRET
6. JWT claims plus fresh DB lookup determine authorization

### Why JWT?

- Stateless (no session store needed)
- Suitable for distributed systems
- Works well with serverless functions
- Portable across frontend and backend

---

## Environment Configuration

### Required Secret

**Variable**: `AUTH_SECRET`

- **Type**: Random, cryptographically secure string (minimum 32 bytes / 256 bits)
- **Length**: 64+ characters (Base64 or hex encoded)
- **Example Format** (DO NOT USE IN PRODUCTION):
  ```
  abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  ```
- **Generation** (use this for production):
  ```bash
  # On macOS/Linux
  openssl rand -hex 32
  
  # On Windows PowerShell
  [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
  ```

### Recommended Environment Variables

```env
# JWT / Session signing
AUTH_SECRET=<generated-random-string>

# Session configuration (optional)
SESSION_COOKIE_NAME=__Secure-session
SESSION_ISSUER=cane-corso-platform
SESSION_AUDIENCE=cane-corso-platform
SESSION_EXPIRY_DAYS=30

# For mobile/future API-only clients
SESSION_REFRESH_TOKEN_EXPIRY_DAYS=90
```

### Environment Variable Rules

1. **Never hardcode** AUTH_SECRET in code
2. **Never commit** AUTH_SECRET in .env or .env.local
3. **Never log** AUTH_SECRET in any form
4. **Never export** AUTH_SECRET in NEXT_PUBLIC_* variables
5. **Load only from environment** at runtime
6. **Validate on startup** that AUTH_SECRET is set

---

## JWT Claims

### Minimal Claims Required

```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "role": "guest|member|admin",
  "authProvider": "local",
  "emailVerified": true,
  "iat": 1234567890,
  "exp": 1234671490,
  "iss": "cane-corso-platform",
  "aud": "cane-corso-platform"
}
```

### Claim Descriptions

| Claim | Type | Meaning | Example |
|-------|------|---------|---------|
| `sub` | string (UUID) | Subject; unique user identifier | `"550e8400-e29b-41d4-a716-446655440000"` |
| `email` | string | User email address | `"user@example.com"` |
| `role` | enum | Authorization level | `"admin"` or `"member"` or `"guest"` |
| `authProvider` | string | How user authenticated | `"local"` |
| `emailVerified` | boolean | Email ownership confirmed | `true` |
| `iat` | number | Issued at (Unix timestamp) | `1704067200` |
| `exp` | number | Expiration time (Unix timestamp) | `1704153600` |
| `iss` | string | Issuer (app identifier) | `"cane-corso-platform"` |
| `aud` | string | Audience (app identifier) | `"cane-corso-platform"` |

### What NOT to Store in JWT

**Never include these in JWT claims** (they may be stale or sensitive):

- ❌ Passwords or password hashes
- ❌ Neon database credentials
- ❌ API keys or tokens
- ❌ Private profile data (phone, address, etc.)
- ❌ Sensitive membership info (payment status, subscription tier) — must re-check from DB
- ❌ Member-only content (pedigree, private media)
- ❌ Admin capability flags — must re-check from DB
- ❌ Session secrets or signing keys

---

## Session Cookie Configuration

### Required Flags

All session cookies **must** have these flags:

```javascript
const cookieOptions = {
  httpOnly: true,      // Not accessible from JavaScript; protects from XSS
  secure: true,        // Only sent over HTTPS; protects from MITM
  sameSite: 'Strict',  // Prevents CSRF; strict mode blocks cross-site cookies
  path: '/',           // Available across entire domain
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in milliseconds
};
```

### Why These Flags?

| Flag | Reason |
|------|--------|
| `httpOnly` | Prevents JavaScript (including injected scripts) from accessing the cookie |
| `secure` | Only sent over HTTPS; blocks accidental transmission over HTTP |
| `sameSite=Strict` | Prevents CSRF attacks by blocking cross-site cookie submission |

### Cookie Lifetime

- **Recommended**: 7–30 days (depends on risk tolerance)
- **Too Short**: Frequent re-authentication frustrates users
- **Too Long**: Longer window of compromise if cookie stolen
- **Best Practice**: 30 days with refresh token option

---

## Authentication Flow

### Login

1. User submits email + password
2. Server looks up user in database
3. Server validates password (bcrypt comparison)
4. If valid:
   - Generate JWT signed with AUTH_SECRET
   - Set JWT in HttpOnly, Secure cookie
   - Redirect to destination
5. If invalid:
   - Return 401 Unauthorized
   - Do not reveal whether email or password is wrong

### Subsequent Requests

1. Browser sends cookie with JWT automatically (HttpOnly)
2. Server extracts JWT from cookie
3. Server validates JWT signature using AUTH_SECRET
4. If valid:
   - Extract claims (sub, email, role)
   - For authorization-critical actions, **re-check role in database**
   - Proceed with request
5. If invalid or expired:
   - Return 401 Unauthorized
   - Client redirects to login

### Logout

1. User clicks logout
2. Server clears session cookie (set empty value with same path/domain)
3. Client redirects to public page
4. JWT in cookie is no longer sent
5. No revocation needed (JWT is stateless)

### Session Expiry

1. JWT contains `exp` claim (expiration Unix timestamp)
2. When `exp` < current time, token is expired
3. Server rejects expired tokens immediately
4. Client must re-authenticate (redirect to login)

---

## Authorization Rules

### Principle: Don't Trust Client Claims Alone

**Wrong** ❌:
```javascript
if (token.claims.role === 'admin') {
  // Grant admin access
  // WRONG: Client could be compromised; JWT could be forged
}
```

**Correct** ✅:
```javascript
const user = await db.user.findById(token.sub);
if (user && user.role === 'admin') {
  // Grant admin access
  // RIGHT: Check fresh data from database
}
```

### Authorization Patterns

#### Public Routes

- No authentication required
- Accessible to anyone
- Examples: Home, public registry, discover partners

#### Member Routes

- Requires `role === 'member'` or higher
- Check DB after validating JWT
- Examples: My Dogs, My Profile, Member Features

#### Admin Routes

- Requires `role === 'admin'`
- Check DB immediately before any mutation
- Re-verify for sensitive actions (certificate issue, profile rejection)
- Examples: Admin Dashboard, Moderation, Certificate Management

---

## Secret Rotation

### When to Rotate

- Quarterly (recommended)
- Immediately if compromise suspected
- When changing auth system
- When rotating signing algorithm

### How to Rotate

1. Generate new AUTH_SECRET
2. Deploy new secret to production environment
3. Keep old secret available for 24–48 hours (grace period)
4. Validate JWTs against both secrets during grace period
5. After grace period, accept only new secret
6. All users with old JWTs automatically logged out

### User Impact

- All existing sessions invalidated
- Users redirected to login
- Users re-authenticate with same password
- No data loss
- Estimate 1–2 hours of support inquiries

---

## Mobile / API Client Considerations

### For Future Mobile (Expo) App

1. **Cannot store secrets client-side** (they're not secure)
2. **Use same JWT mechanism** as web (but different delivery)
3. **Options**:
   - Option A: Same HttpOnly cookie (if using WebView)
   - Option B: JWT in memory (lost on app close) + refresh token in secure storage
   - Option C: BioAuth (Face ID / Touch ID) + refresh flow

### Sample Refresh Token Flow (For Future)

1. Login returns short-lived JWT (15 min) + long-lived refresh token (90 days)
2. Refresh token stored in secure storage (NOT localStorage)
3. When JWT expires, use refresh token to get new JWT
4. If refresh token invalid, require re-login

---

## Common Mistakes to Avoid

❌ **Mistake**: Storing AUTH_SECRET in version control  
✅ **Correct**: Load from environment only

❌ **Mistake**: Logging JWT tokens  
✅ **Correct**: Log only `sub` and `email` (identifiers)

❌ **Mistake**: Storing JWT in localStorage  
✅ **Correct**: Use HttpOnly cookies

❌ **Mistake**: Trusting client-provided role without DB check  
✅ **Correct**: Always re-verify authorization in database

❌ **Mistake**: Storing password in JWT  
✅ **Correct**: Store only user ID; look up role in DB

❌ **Mistake**: Forgetting `sameSite=Strict` flag  
✅ **Correct**: Use Strict to prevent CSRF

❌ **Mistake**: Using symmetric encryption for secrets (hardcoding)  
✅ **Correct**: Load secrets from environment

---

## Testing Checklist

- [ ] AUTH_SECRET is loaded from environment
- [ ] AUTH_SECRET is not logged anywhere
- [ ] AUTH_SECRET is not exported in NEXT_PUBLIC_*
- [ ] JWT is signed with AUTH_SECRET
- [ ] JWT validation rejects forged signatures
- [ ] JWT validation rejects expired tokens
- [ ] HttpOnly flag is set on session cookie
- [ ] Secure flag is set on session cookie (HTTPS only)
- [ ] SameSite=Strict is set on session cookie
- [ ] Login creates JWT correctly
- [ ] Logout clears JWT cookie
- [ ] Authorization re-checks database for role
- [ ] Admin actions verify fresh DB role
- [ ] Password is never stored in JWT
- [ ] Session persists across page reload
- [ ] Session expires after configured time
- [ ] Expired token forces re-login
- [ ] Multiple concurrent sessions per user are handled (if allowed)

---

## Pre-Production Checklist

Before going to production:

- [ ] AUTH_SECRET generated and stored in deployment secrets
- [ ] AUTH_SECRET is 64+ characters
- [ ] Rotation procedure documented
- [ ] Cookie flags validated (httpOnly, secure, sameSite)
- [ ] No secrets in logs
- [ ] No secrets in error messages
- [ ] No secrets in monitoring/APM
- [ ] Login/logout flow tested
- [ ] Authorization checks verified
- [ ] Token expiry tested
- [ ] Password reset flow tested
- [ ] Multiple login scenarios tested
- [ ] Security audit passed

---

## Related Documents

- [Neon Readiness Contract](neon-readiness-contract.md) — Database integration (not auth)
- [AGENTS.md](../AGENTS.md) — Coding rules including JWT/Session rules
- [Step 57 Platform Readiness Audit](../qa/step57-platform-readiness-audit.md) — Auth/session validation checklist

---

**Document Status**: Ready for implementation  
**Last Updated**: May 3, 2026
